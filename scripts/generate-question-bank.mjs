import fs from "node:fs";
import path from "node:path";

const base = {
  difficulty: "Easy",
  followUps: ["Can you explain this with one simple example?"],
  evaluationPoints: ["Clarity", "Correct basics", "Practical explanation"],
  strongIndicators: ["Explains confidently", "Uses a simple example"],
  weakIndicators: ["Gives a memorized answer only", "Cannot explain in own words"],
  redFlags: ["Cannot answer basic follow-up"],
};

const intro = [
  ["Tell me about yourself.", "A concise introduction covering education, skills, project or internship work, and interest in QA/testing.", "Use a 60-90 second structure: education, technical skills, project, and why testing.", "A good answer starts with the candidate's degree or current status, then mentions technical skills such as Java, Python, SQL, manual testing, or Selenium basics. It should include one project or internship example and end with why the candidate is interested in a QA or automation testing role."],
  ["What technologies or skills have you worked on?", "Mention programming basics, SQL, testing concepts, tools, project work, and any internship exposure.", "Group the answer by programming, database, testing, and tools.", "The candidate can mention languages, database queries, frontend/backend basics, manual testing concepts, Selenium basics, API exposure, Git, or project work. The answer should be honest and should not claim deep expertise without practical examples."],
  ["Explain one project you worked on.", "Explain the project goal, tech stack, your contribution, key features, and what you learned.", "Use problem, solution, role, and outcome.", "A complete answer explains what the project does, who uses it, which technologies were used, and what exact work the candidate handled. For testing roles, listen for how they validated forms, data, login, database changes, or error handling."],
  ["What was your role in the project?", "Clearly state responsibilities such as coding, testing, database work, documentation, or bug fixing.", "Be specific about ownership instead of saying the team did everything.", "The answer should separate team contribution from personal contribution. Strong fresher answers mention screens built, test cases written, SQL queries used, bugs fixed, documentation prepared, or demo responsibilities."],
  ["What challenge did you face in the project?", "Describe one real issue, how you analyzed it, and how it was solved.", "Use situation, action, result.", "The candidate should describe a practical challenge such as login validation, database connection, API response mismatch, UI bug, deployment issue, or unclear requirement. The important part is how they investigated and what they learned."],
  ["Have you worked with APIs or databases?", "Answer honestly and describe basic exposure such as SQL queries, tables, Postman, or API request/response.", "Connect API/database exposure to testing scenarios.", "For APIs, acceptable exposure includes knowing request, response, status code, JSON, and Postman basics. For databases, acceptable exposure includes tables, rows, SELECT, WHERE, joins, and checking whether application data was saved correctly."],
  ["Why are you interested in testing?", "Testing helps improve quality, find defects early, and understand applications from a user perspective.", "Show curiosity for quality, detail, and learning automation.", "A strong fresher answer connects testing with product quality, user experience, attention to detail, and learning automation tools. Avoid answers that say testing is easier than development."],
  ["Difference between frontend and backend?", "Frontend is the user-facing UI. Backend handles business logic, database, APIs, and server-side processing.", "Explain using a login page: UI fields are frontend, credential validation is backend.", "Example: on a login page, username/password fields and buttons are frontend. The backend checks credentials, applies rules, talks to the database, and returns success or error. Testing should cover both UI behavior and backend response."],
  ["What is debugging?", "Debugging is finding, analyzing, and fixing the cause of an error or unexpected behavior.", "Mention checking logs, reproducing issue, and verifying the fix.", "A good answer includes reproducing the issue, checking input data, reading error messages or logs, isolating the failing step, fixing the cause, and retesting to confirm the issue is resolved."],
  ["How do you test if a login page is working correctly?", "Check valid login, invalid login, empty fields, password masking, error messages, forgot password, session behavior, and basic security cases.", "Cover positive, negative, UI, validation, and edge cases.", "A detailed answer includes valid credentials, invalid password, unregistered user, empty username/password, password masking, error message accuracy, forgot password link, remember me, logout/session expiry, SQL injection-like input, and browser/mobile layout checks."],
];

const coding = [
  {
    title: "Palindrome Check",
    question: "Check whether a string is palindrome or not.",
    time: "O(n)",
    approach: "Use two pointers, one from the start and one from the end. Compare characters while moving inward.",
    solution: `function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    output: `Input: "madam"\nOutput: true`,
  },
  {
    title: "Two Sum",
    question: "Find two indices whose sum equals target.",
    time: "O(n)",
    approach: "Use a hash map to store visited numbers and their indices. For each number, check if target - number already exists.",
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    output: `Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]`,
  },
  {
    title: "Prime Number",
    question: "Check whether number is prime.",
    time: "O(sqrt(n))",
    approach: "A prime number is greater than 1 and divisible only by 1 and itself. Check divisibility from 2 to square root of n.",
    solution: `function isPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
    output: `Input: 7\nOutput: true`,
  },
  {
    title: "Factorial",
    question: "Find factorial of a number.",
    time: "O(n)",
    approach: "Start with result as 1 and multiply numbers from 2 to n.",
    solution: `function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}`,
    output: `Input: 5\nOutput: 120`,
  },
  {
    title: "Fibonacci Series",
    question: "Print fibonacci series.",
    time: "O(n)",
    approach: "Keep two previous values and repeatedly calculate the next value.",
    solution: `function fibonacci(n) {
  const result = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }
  return result;
}`,
    output: `Input: 6\nOutput: [0, 1, 1, 2, 3, 5]`,
  },
  {
    title: "Anagram Check",
    question: "Check whether two strings are anagram.",
    time: "O(n log n)",
    approach: "Sort both strings and compare them, or count character frequencies for an O(n) approach.",
    solution: `function isAnagram(a, b) {
  return a.split("").sort().join("") === b.split("").sort().join("");
}`,
    output: `Input: "listen", "silent"\nOutput: true`,
  },
  {
    title: "Count Vowels",
    question: "Count vowels in a string.",
    time: "O(n)",
    approach: "Loop through every character and count it if it is present in the vowel set.",
    solution: `function countVowels(str) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let count = 0;
  for (const ch of str.toLowerCase()) {
    if (vowels.has(ch)) count++;
  }
  return count;
}`,
    output: `Input: "automation"\nOutput: 6`,
  },
  {
    title: "Remove Duplicates",
    question: "Remove duplicates from array.",
    time: "O(n)",
    approach: "Use a Set to keep unique values while preserving first occurrence order.",
    solution: `function removeDuplicates(arr) {
  return [...new Set(arr)];
}`,
    output: `Input: [1, 2, 2, 3, 1]\nOutput: [1, 2, 3]`,
  },
  {
    title: "Frequency Count",
    question: "Count frequency of characters.",
    time: "O(n)",
    approach: "Use an object or map. For every character, increment its count.",
    solution: `function charFrequency(str) {
  const freq = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}`,
    output: `Input: "test"\nOutput: { t: 2, e: 1, s: 1 }`,
  },
  {
    title: "Move Zeros to End",
    question: "Move all zeros to end.",
    time: "O(n)",
    approach: "Copy non-zero values first, then fill remaining positions with zero.",
    solution: `function moveZeros(arr) {
  const result = arr.filter((num) => num !== 0);
  while (result.length < arr.length) result.push(0);
  return result;
}`,
    output: `Input: [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]`,
  },
];

const testing = [
  ["Manual Testing", "Testing done by humans manually without automation tools."],
  ["Automation Testing", "Testing using tools or scripts to automate repetitive tasks."],
  ["Black Box Testing", "Testing functionality without knowing the internal code."],
  ["White Box Testing", "Testing internal code and logic."],
  ["Regression Testing", "Ensuring old functionality still works after changes."],
  ["Smoke Testing", "Basic testing to check build stability."],
  ["Popular Automation Tools", "Selenium, Cypress, Playwright, Appium, and JMeter."],
];

const sql = [
  ["Find all employees", "SELECT * FROM employees;", "Returns every row and column from the employees table."],
  ["Employees with salary > 50000", "SELECT * FROM employees WHERE salary > 50000;", "Returns employees whose salary is greater than 50000."],
  ["Count employees department wise", "SELECT department, COUNT(*) FROM employees GROUP BY department;", "Returns each department with its employee count."],
  ["Find second highest salary", "SELECT MAX(salary)\nFROM employees\nWHERE salary < (\n  SELECT MAX(salary) FROM employees\n);", "Returns the second highest salary from the employees table."],
];

const solutionTemplates = {
  twoPointers: {
    python: `def solve(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        left += 1
        right -= 1
    return nums`,
    java: `class Solution {
    public int[] solve(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            left++;
            right--;
        }
        return nums;
    }
}`,
    javascript: `function solve(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    left++;
    right--;
  }
  return nums;
}`,
    cpp: `class Solution {
public:
    vector<int> solve(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            left++;
            right--;
        }
        return nums;
    }
};`,
  },
  hashMap: {
    python: `def solve(nums):
    seen = {}
    for i, value in enumerate(nums):
        if value in seen:
            return True
        seen[value] = i
    return False`,
    java: `class Solution {
    public boolean solve(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int value : nums) {
            if (seen.contains(value)) return true;
            seen.add(value);
        }
        return false;
    }
}`,
    javascript: `function solve(nums) {
  const seen = new Set();
  for (const value of nums) {
    if (seen.has(value)) return true;
    seen.add(value);
  }
  return false;
}`,
    cpp: `class Solution {
public:
    bool solve(vector<int>& nums) {
        unordered_set<int> seen;
        for (int value : nums) {
            if (seen.count(value)) return true;
            seen.insert(value);
        }
        return false;
    }
};`,
  },
  slidingWindow: {
    python: `def solve(nums, k):
    left = 0
    window = 0
    best = 0
    for right, value in enumerate(nums):
        window += value
        while right - left + 1 > k:
            window -= nums[left]
            left += 1
        best = max(best, window)
    return best`,
    java: `class Solution {
    public int solve(int[] nums, int k) {
        int left = 0, window = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            window += nums[right];
            while (right - left + 1 > k) window -= nums[left++];
            best = Math.max(best, window);
        }
        return best;
    }
}`,
    javascript: `function solve(nums, k) {
  let left = 0, window = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    window += nums[right];
    while (right - left + 1 > k) window -= nums[left++];
    best = Math.max(best, window);
  }
  return best;
}`,
    cpp: `class Solution {
public:
    int solve(vector<int>& nums, int k) {
        int left = 0, window = 0, best = 0;
        for (int right = 0; right < nums.size(); right++) {
            window += nums[right];
            while (right - left + 1 > k) window -= nums[left++];
            best = max(best, window);
        }
        return best;
    }
};`,
  },
  stack: {
    python: `def solve(items):
    stack = []
    for item in items:
        if stack and stack[-1] == item:
            stack.pop()
        else:
            stack.append(item)
    return stack`,
    java: `class Solution {
    public List<Integer> solve(int[] items) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int item : items) {
            if (!stack.isEmpty() && stack.peek() == item) stack.pop();
            else stack.push(item);
        }
        return new ArrayList<>(stack);
    }
}`,
    javascript: `function solve(items) {
  const stack = [];
  for (const item of items) {
    if (stack.length && stack[stack.length - 1] === item) stack.pop();
    else stack.push(item);
  }
  return stack;
}`,
    cpp: `class Solution {
public:
    vector<int> solve(vector<int>& items) {
        vector<int> st;
        for (int item : items) {
            if (!st.empty() && st.back() == item) st.pop_back();
            else st.push_back(item);
        }
        return st;
    }
};`,
  },
  binarySearch: {
    python: `def solve(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    java: `class Solution {
    public int solve(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
    javascript: `function solve(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    cpp: `class Solution {
public:
    int solve(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
};`,
  },
  bfs: {
    python: `from collections import deque

def solve(graph, start):
    seen = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nei in graph[node]:
            if nei not in seen:
                seen.add(nei)
                queue.append(nei)
    return order`,
    java: `class Solution {
    public List<Integer> solve(List<List<Integer>> graph, int start) {
        boolean[] seen = new boolean[graph.size()];
        Queue<Integer> queue = new ArrayDeque<>();
        List<Integer> order = new ArrayList<>();
        seen[start] = true;
        queue.add(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int nei : graph.get(node)) {
                if (!seen[nei]) {
                    seen[nei] = true;
                    queue.add(nei);
                }
            }
        }
        return order;
    }
}`,
    javascript: `function solve(graph, start) {
  const seen = new Set([start]);
  const queue = [start];
  const order = [];
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    order.push(node);
    for (const nei of graph[node]) {
      if (!seen.has(nei)) {
        seen.add(nei);
        queue.push(nei);
      }
    }
  }
  return order;
}`,
    cpp: `class Solution {
public:
    vector<int> solve(vector<vector<int>>& graph, int start) {
        vector<int> order, seen(graph.size());
        queue<int> q;
        seen[start] = 1;
        q.push(start);
        while (!q.empty()) {
            int node = q.front(); q.pop();
            order.push_back(node);
            for (int nei : graph[node]) {
                if (!seen[nei]) {
                    seen[nei] = 1;
                    q.push(nei);
                }
            }
        }
        return order;
    }
};`,
  },
  dp: {
    python: `def solve(nums):
    if not nums:
        return 0
    dp0, dp1 = 0, nums[0]
    for value in nums[1:]:
        dp0, dp1 = dp1, max(dp1, dp0 + value)
    return dp1`,
    java: `class Solution {
    public int solve(int[] nums) {
        int prev = 0, curr = 0;
        for (int value : nums) {
            int next = Math.max(curr, prev + value);
            prev = curr;
            curr = next;
        }
        return curr;
    }
}`,
    javascript: `function solve(nums) {
  let prev = 0, curr = 0;
  for (const value of nums) {
    const next = Math.max(curr, prev + value);
    prev = curr;
    curr = next;
  }
  return curr;
}`,
    cpp: `class Solution {
public:
    int solve(vector<int>& nums) {
        int prev = 0, curr = 0;
        for (int value : nums) {
            int next = max(curr, prev + value);
            prev = curr;
            curr = next;
        }
        return curr;
    }
};`,
  },
};

const leetcode75 = [
  ["Merge Strings Alternately", "Array / String", "twoPointers", "Easy"],
  ["Greatest Common Divisor of Strings", "Array / String", "twoPointers", "Easy"],
  ["Kids With the Greatest Number of Candies", "Array / String", "twoPointers", "Easy"],
  ["Can Place Flowers", "Array / String", "twoPointers", "Easy"],
  ["Reverse Vowels of a String", "Array / String", "twoPointers", "Easy"],
  ["Reverse Words in a String", "Array / String", "twoPointers", "Medium"],
  ["Product of Array Except Self", "Array / String", "hashMap", "Medium"],
  ["Increasing Triplet Subsequence", "Array / String", "twoPointers", "Medium"],
  ["String Compression", "Array / String", "twoPointers", "Medium"],
  ["Move Zeroes", "Two Pointers", "twoPointers", "Easy"],
  ["Is Subsequence", "Two Pointers", "twoPointers", "Easy"],
  ["Container With Most Water", "Two Pointers", "twoPointers", "Medium"],
  ["Max Number of K-Sum Pairs", "Two Pointers", "hashMap", "Medium"],
  ["Maximum Average Subarray I", "Sliding Window", "slidingWindow", "Easy"],
  ["Maximum Number of Vowels in a Substring of Given Length", "Sliding Window", "slidingWindow", "Medium"],
  ["Max Consecutive Ones III", "Sliding Window", "slidingWindow", "Medium"],
  ["Longest Subarray of 1's After Deleting One Element", "Sliding Window", "slidingWindow", "Medium"],
  ["Find the Highest Altitude", "Prefix Sum", "hashMap", "Easy"],
  ["Find Pivot Index", "Prefix Sum", "hashMap", "Easy"],
  ["Find the Difference of Two Arrays", "Hash Map / Set", "hashMap", "Easy"],
  ["Unique Number of Occurrences", "Hash Map / Set", "hashMap", "Easy"],
  ["Determine if Two Strings Are Close", "Hash Map / Set", "hashMap", "Medium"],
  ["Equal Row and Column Pairs", "Hash Map / Set", "hashMap", "Medium"],
  ["Removing Stars From a String", "Stack", "stack", "Medium"],
  ["Asteroid Collision", "Stack", "stack", "Medium"],
  ["Decode String", "Stack", "stack", "Medium"],
  ["Number of Recent Calls", "Queue", "slidingWindow", "Easy"],
  ["Dota2 Senate", "Queue", "slidingWindow", "Medium"],
  ["Delete the Middle Node of a Linked List", "Linked List", "twoPointers", "Medium"],
  ["Odd Even Linked List", "Linked List", "twoPointers", "Medium"],
  ["Reverse Linked List", "Linked List", "twoPointers", "Easy"],
  ["Maximum Twin Sum of a Linked List", "Linked List", "twoPointers", "Medium"],
  ["Maximum Depth of Binary Tree", "Binary Tree - DFS", "bfs", "Easy"],
  ["Leaf-Similar Trees", "Binary Tree - DFS", "bfs", "Easy"],
  ["Count Good Nodes in Binary Tree", "Binary Tree - DFS", "bfs", "Medium"],
  ["Path Sum III", "Binary Tree - DFS", "hashMap", "Medium"],
  ["Longest ZigZag Path in a Binary Tree", "Binary Tree - DFS", "bfs", "Medium"],
  ["Lowest Common Ancestor of a Binary Tree", "Binary Tree - DFS", "bfs", "Medium"],
  ["Binary Tree Right Side View", "Binary Tree - BFS", "bfs", "Medium"],
  ["Maximum Level Sum of a Binary Tree", "Binary Tree - BFS", "bfs", "Medium"],
  ["Search in a Binary Search Tree", "Binary Search Tree", "binarySearch", "Easy"],
  ["Delete Node in a BST", "Binary Search Tree", "binarySearch", "Medium"],
  ["Keys and Rooms", "Graphs - DFS", "bfs", "Medium"],
  ["Number of Provinces", "Graphs - DFS", "bfs", "Medium"],
  ["Reorder Routes to Make All Paths Lead to the City Zero", "Graphs - DFS", "bfs", "Medium"],
  ["Evaluate Division", "Graphs - DFS", "bfs", "Medium"],
  ["Nearest Exit from Entrance in Maze", "Graphs - BFS", "bfs", "Medium"],
  ["Rotting Oranges", "Graphs - BFS", "bfs", "Medium"],
  ["Kth Largest Element in an Array", "Heap / Priority Queue", "hashMap", "Medium"],
  ["Smallest Number in Infinite Set", "Heap / Priority Queue", "hashMap", "Medium"],
  ["Maximum Subsequence Score", "Heap / Priority Queue", "hashMap", "Medium"],
  ["Total Cost to Hire K Workers", "Heap / Priority Queue", "hashMap", "Medium"],
  ["Guess Number Higher or Lower", "Binary Search", "binarySearch", "Easy"],
  ["Successful Pairs of Spells and Potions", "Binary Search", "binarySearch", "Medium"],
  ["Find Peak Element", "Binary Search", "binarySearch", "Medium"],
  ["Koko Eating Bananas", "Binary Search", "binarySearch", "Medium"],
  ["Letter Combinations of a Phone Number", "Backtracking", "bfs", "Medium"],
  ["Combination Sum III", "Backtracking", "bfs", "Medium"],
  ["N-th Tribonacci Number", "DP - 1D", "dp", "Easy"],
  ["Min Cost Climbing Stairs", "DP - 1D", "dp", "Easy"],
  ["House Robber", "DP - 1D", "dp", "Medium"],
  ["Domino and Tromino Tiling", "DP - 1D", "dp", "Medium"],
  ["Unique Paths", "DP - Multidimensional", "dp", "Medium"],
  ["Longest Common Subsequence", "DP - Multidimensional", "dp", "Medium"],
  ["Best Time to Buy and Sell Stock with Transaction Fee", "DP - Multidimensional", "dp", "Medium"],
  ["Edit Distance", "DP - Multidimensional", "dp", "Medium"],
  ["Counting Bits", "Bit Manipulation", "dp", "Easy"],
  ["Single Number", "Bit Manipulation", "hashMap", "Easy"],
  ["Minimum Flips to Make a OR b Equal to c", "Bit Manipulation", "twoPointers", "Medium"],
  ["Implement Trie (Prefix Tree)", "Trie", "hashMap", "Medium"],
  ["Search Suggestions System", "Trie", "hashMap", "Medium"],
  ["Non-overlapping Intervals", "Intervals", "twoPointers", "Medium"],
  ["Minimum Number of Arrows to Burst Balloons", "Intervals", "twoPointers", "Medium"],
  ["Daily Temperatures", "Monotonic Stack", "stack", "Medium"],
  ["Online Stock Span", "Monotonic Stack", "stack", "Medium"],
];

const items = [];

intro.forEach(([question, answer, approach], index) => {
  items.push({
    ...base,
    id: `intro-${String(index + 1).padStart(2, "0")}`,
    category: "Introduction",
    question,
    answer,
    expectedFresherAnswer: answer,
    minimumAcceptableAnswer: answer,
    hint: approach,
    optimalApproach: approach,
    output: "Expected output: clear spoken answer from the candidate.",
    solution: answer,
    tags: ["introduction", "communication"],
  });
});

coding.forEach((item, index) => {
  items.push({
    ...base,
    id: `coding-${String(index + 1).padStart(2, "0")}`,
    category: "Coding Logic",
    question: item.question,
    answer: item.approach,
    expectedFresherAnswer: `Explain the input, choose the simple approach, dry-run one example, and mention ${item.time} time complexity. ${item.approach}`,
    minimumAcceptableAnswer: "Candidate should explain the basic loop/map/string approach and dry-run one example.",
    hint: item.approach,
    optimalApproach: item.approach,
    output: item.output,
    solution: item.solution,
    timeComplexity: item.time,
    tags: ["logic", item.title.toLowerCase().replaceAll(" ", "-")],
  });
});

testing.forEach(([question, answer], index) => {
  items.push({
    ...base,
    id: `testing-${String(index + 1).padStart(2, "0")}`,
    category: "Testing",
    question: `What is ${question}?`,
    answer,
    expectedFresherAnswer: `${answer} The candidate should also give one example, such as testing a login page, registration form, cart flow, or API response.`,
    minimumAcceptableAnswer: answer,
    hint: "Ask for a simple example from a login, cart, or registration page.",
    optimalApproach: "Define the testing term first, then give one practical QA example.",
    output: "Expected output: correct definition with a simple example.",
    solution: answer,
    tags: ["testing"],
  });
});

sql.forEach(([question, query, output], index) => {
  items.push({
    ...base,
    id: `sql-${String(index + 1).padStart(2, "0")}`,
    category: "SQL",
    question,
    answer: query,
    expectedFresherAnswer: `The candidate should identify the table, choose the right SQL clause, write the query, and explain the result. Correct query:\n${query}`,
    minimumAcceptableAnswer: "Candidate should use the correct SQL keywords and explain the result.",
    hint: "Focus on SELECT, FROM, WHERE, GROUP BY, COUNT, and MAX.",
    optimalApproach: "Identify the table, required columns, filter or grouping condition, then write the query.",
    output,
    solution: query,
    tags: ["sql"],
  });
});

leetcode75.forEach(([title, topic, templateKey, difficulty], index) => {
  const templates = solutionTemplates[templateKey];
  const approach = `Recognize this as a ${topic} problem. State the brute-force idea first if useful, then use the standard ${templateKey.replace(/([A-Z])/g, " $1").toLowerCase()} pattern to reduce repeated work and handle edge cases.`;
  items.push({
    ...base,
    id: `leetcode75-${String(index + 1).padStart(2, "0")}`,
    category: "DSA",
    question: `${title}`,
    answer: approach,
    expectedFresherAnswer: `Explain the input and output, identify the ${topic} pattern, walk through one sample test case, and then code the optimized approach. The candidate should mention edge cases before writing code.`,
    minimumAcceptableAnswer: `Candidate should know the ${topic} pattern and be able to dry-run a small example.`,
    hint: `Use the ${topic} pattern. Start by naming the data structure or pointer/window state you need to maintain.`,
    optimalApproach: approach,
    output: `Use the sample from the problem statement. Expected output depends on the provided input; interviewer should ask the candidate to dry-run at least one sample.`,
    solution: templates.javascript,
    solutions: templates,
    timeComplexity: templateKey === "binarySearch" ? "O(log n)" : templateKey === "dp" ? "O(n)" : "O(n)",
    dsaTopic: topic,
    difficulty,
    tags: ["leetcode-75", topic.toLowerCase().replaceAll(" ", "-").replaceAll("/", "")],
    followUps: [
      "What edge case can break this solution?",
      "What is the time and space complexity?",
      "Can you dry-run the sample input?",
    ],
    evaluationPoints: ["Pattern recognition", "Edge cases", "Dry run", "Complexity explanation"],
    strongIndicators: ["Names the right pattern quickly", "Explains state clearly", "Handles edge cases"],
    weakIndicators: ["Jumps into code without approach", "Cannot dry-run", "Does not know complexity"],
    redFlags: ["Memorizes code but cannot explain why it works"],
  });
});

const target = path.join(process.cwd(), "src", "data", "question-bank.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify(items, null, 2)}\n`);
console.log(`Wrote ${items.length} document-based questions to ${target}`);
