export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface StriverProblem {
  id: string;
  name: string;
  url: string;
  difficulty: Difficulty;
}

export interface StriverTopic {
  name: string;
  problems: StriverProblem[];
}

export const STRIVER_SHEET: StriverTopic[] = [
  {
    name: 'Arrays',
    problems: [
      { id: 'set-matrix-zeroes', name: 'Set Matrix Zeroes', url: '#', difficulty: 'Medium' },
      { id: 'pascals-triangle', name: 'Pascal\'s Triangle', url: '#', difficulty: 'Easy' },
      { id: 'next-permutation', name: 'Next Permutation', url: '#', difficulty: 'Medium' },
      { id: 'kadanes-algorithm', name: 'Kadane\'s Algorithm', url: '#', difficulty: 'Medium' },
      { id: 'sort-012', name: 'Sort an array of 0s 1s 2s', url: '#', difficulty: 'Medium' },
      { id: 'stock-buy-and-sell', name: 'Stock buy and Sell', url: '#', difficulty: 'Easy' }
    ]
  },
  {
    name: 'Arrays Part-II',
    problems: [
      { id: 'rotate-matrix', name: 'Rotate Matrix', url: '#', difficulty: 'Medium' },
      { id: 'merge-intervals', name: 'Merge Overlapping Subintervals', url: '#', difficulty: 'Medium' },
      { id: 'merge-two-sorted-arrays', name: 'Merge two sorted Arrays without extra space', url: '#', difficulty: 'Hard' },
      { id: 'find-duplicate', name: 'Find the duplicate in an array of N+1 integers', url: '#', difficulty: 'Medium' },
      { id: 'repeat-and-missing', name: 'Repeat and Missing Number', url: '#', difficulty: 'Medium' },
      { id: 'inversion-count', name: 'Inversion of Array', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Arrays Part-III',
    problems: [
      { id: 'search-2d-matrix', name: 'Search in a 2D matrix', url: '#', difficulty: 'Medium' },
      { id: 'pow-x-n', name: 'Pow(X,n)', url: '#', difficulty: 'Medium' },
      { id: 'majority-element', name: 'Majority Element (>N/2 times)', url: '#', difficulty: 'Easy' },
      { id: 'majority-element-2', name: 'Majority Element (>N/3 times)', url: '#', difficulty: 'Medium' },
      { id: 'grid-unique-paths', name: 'Grid Unique Paths', url: '#', difficulty: 'Medium' },
      { id: 'reverse-pairs', name: 'Reverse Pairs', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Arrays Part-IV',
    problems: [
      { id: 'two-sum', name: '2-Sum-Problem', url: '#', difficulty: 'Easy' },
      { id: 'four-sum', name: '4-sum-Problem', url: '#', difficulty: 'Medium' },
      { id: 'longest-consecutive-sequence', name: 'Longest Consecutive Sequence', url: '#', difficulty: 'Medium' },
      { id: 'largest-subarray-zero-sum', name: 'Largest Subarray with 0 sum', url: '#', difficulty: 'Medium' },
      { id: 'count-subarrays-xor', name: 'Count number of subarrays with given Xor K', url: '#', difficulty: 'Medium' },
      { id: 'longest-substring-without-repeat', name: 'Longest Substring without repeat', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Linked List',
    problems: [
      { id: 'reverse-linked-list', name: 'Reverse a LinkedList', url: '#', difficulty: 'Easy' },
      { id: 'middle-of-linked-list', name: 'Find the middle of LinkedList', url: '#', difficulty: 'Easy' },
      { id: 'merge-two-sorted-lists', name: 'Merge two sorted Linked List', url: '#', difficulty: 'Easy' },
      { id: 'remove-nth-node', name: 'Remove N-th node from back of LinkedList', url: '#', difficulty: 'Medium' },
      { id: 'add-two-numbers', name: 'Add two numbers as LinkedList', url: '#', difficulty: 'Medium' },
      { id: 'delete-node', name: 'Delete a given Node when a node is given', url: '#', difficulty: 'Easy' }
    ]
  },
  {
    name: 'Linked List Part-II',
    problems: [
      { id: 'intersection-of-y', name: 'Find intersection point of Y LinkedList', url: '#', difficulty: 'Easy' },
      { id: 'detect-loop', name: 'Detect a cycle in Linked List', url: '#', difficulty: 'Easy' },
      { id: 'reverse-k-groups', name: 'Reverse a LinkedList in groups of size k', url: '#', difficulty: 'Hard' },
      { id: 'palindrome-linked-list', name: 'Check if a LinkedList is palindrome', url: '#', difficulty: 'Easy' },
      { id: 'starting-point-of-loop', name: 'Find the starting point of the Loop of LinkedList', url: '#', difficulty: 'Medium' },
      { id: 'flatten-linked-list', name: 'Flattening of a LinkedList', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Linked List and Arrays',
    problems: [
      { id: 'rotate-linked-list', name: 'Rotate a LinkedList', url: '#', difficulty: 'Medium' },
      { id: 'clone-linked-list', name: 'Clone a Linked List with random and next pointer', url: '#', difficulty: 'Medium' },
      { id: '3-sum', name: '3 sum', url: '#', difficulty: 'Medium' },
      { id: 'trapping-rainwater', name: 'Trapping rainwater', url: '#', difficulty: 'Hard' },
      { id: 'remove-duplicates-sorted-array', name: 'Remove Duplicate from Sorted array', url: '#', difficulty: 'Easy' },
      { id: 'max-consecutive-ones', name: 'Max consecutive ones', url: '#', difficulty: 'Easy' }
    ]
  },
  {
    name: 'Greedy Algorithm',
    problems: [
      { id: 'n-meetings-in-one-room', name: 'N meetings in one room', url: '#', difficulty: 'Medium' },
      { id: 'minimum-platforms', name: 'Minimum number of platforms required for a railway', url: '#', difficulty: 'Medium' },
      { id: 'job-sequencing', name: 'Job sequencing Problem', url: '#', difficulty: 'Medium' },
      { id: 'fractional-knapsack', name: 'Fractional Knapsack Problem', url: '#', difficulty: 'Medium' },
      { id: 'minimum-coins', name: 'Find minimum number of coins', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Recursion',
    problems: [
      { id: 'subset-sums', name: 'Subset Sums', url: '#', difficulty: 'Medium' },
      { id: 'subsets-ii', name: 'Subsets II', url: '#', difficulty: 'Medium' },
      { id: 'combination-sum-1', name: 'Combination sum-1', url: '#', difficulty: 'Medium' },
      { id: 'combination-sum-2', name: 'Combination sum-2', url: '#', difficulty: 'Medium' },
      { id: 'palindrome-partitioning', name: 'Palindrome Partitioning', url: '#', difficulty: 'Medium' },
      { id: 'kth-permutation-sequence', name: 'K-th permutation Sequence', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Recursion and Backtracking',
    problems: [
      { id: 'permutations', name: 'Print all permutations of a string/array', url: '#', difficulty: 'Medium' },
      { id: 'n-queens', name: 'N queens Problem', url: '#', difficulty: 'Hard' },
      { id: 'sudoku-solver', name: 'Sudoku Solver', url: '#', difficulty: 'Hard' },
      { id: 'm-coloring', name: 'M coloring Problem', url: '#', difficulty: 'Medium' },
      { id: 'rat-in-a-maze', name: 'Rat in a Maze', url: '#', difficulty: 'Medium' },
      { id: 'word-break-print', name: 'Word Break (print all ways)', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Binary Search',
    problems: [
      { id: 'nth-root-integer', name: 'The N-th root of an integer', url: '#', difficulty: 'Easy' },
      { id: 'matrix-median', name: 'Matrix Median', url: '#', difficulty: 'Medium' },
      { id: 'single-element-sorted-array', name: 'Find the element that appears once in a sorted array, and the rest element appears twice', url: '#', difficulty: 'Medium' },
      { id: 'search-in-rotated-sorted-array', name: 'Search element in a sorted and rotated array', url: '#', difficulty: 'Medium' },
      { id: 'median-of-two-sorted-arrays', name: 'Median of 2 sorted arrays', url: '#', difficulty: 'Hard' },
      { id: 'kth-element-of-two-sorted-arrays', name: 'K-th element of two sorted arrays', url: '#', difficulty: 'Hard' },
      { id: 'allocate-minimum-number-of-pages', name: 'Allocate Minimum Number of Pages', url: '#', difficulty: 'Hard' },
      { id: 'aggressive-cows', name: 'Aggressive Cows', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Heaps',
    problems: [
      { id: 'implement-max-heap', name: 'Max heap, Min Heap Implementation', url: '#', difficulty: 'Medium' },
      { id: 'kth-largest-element', name: 'Kth Largest Element', url: '#', difficulty: 'Medium' },
      { id: 'maximum-sum-combination', name: 'Maximum Sum Combination', url: '#', difficulty: 'Medium' },
      { id: 'find-median-from-data-stream', name: 'Find Median from Data Stream', url: '#', difficulty: 'Hard' },
      { id: 'merge-k-sorted-arrays', name: 'Merge K sorted arrays', url: '#', difficulty: 'Hard' },
      { id: 'top-k-frequent-elements', name: 'K most frequent elements', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Stack and Queue',
    problems: [
      { id: 'implement-stack-arrays', name: 'Implement Stack using Arrays', url: '#', difficulty: 'Easy' },
      { id: 'implement-queue-arrays', name: 'Implement Queue using Arrays', url: '#', difficulty: 'Easy' },
      { id: 'implement-stack-queue', name: 'Implement Stack using Queue', url: '#', difficulty: 'Easy' },
      { id: 'implement-queue-stack', name: 'Implement Queue using Stack', url: '#', difficulty: 'Easy' },
      { id: 'valid-parentheses', name: 'Check for balanced parentheses', url: '#', difficulty: 'Easy' },
      { id: 'next-greater-element', name: 'Next Greater Element', url: '#', difficulty: 'Medium' },
      { id: 'sort-a-stack', name: 'Sort a Stack', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Stack and Queue Part-II',
    problems: [
      { id: 'next-smaller-element', name: 'Next Smaller Element', url: '#', difficulty: 'Medium' },
      { id: 'lru-cache', name: 'LRU cache', url: '#', difficulty: 'Hard' },
      { id: 'lfu-cache', name: 'LFU Cache', url: '#', difficulty: 'Hard' },
      { id: 'largest-rectangle-histogram', name: 'Largest rectangle in a histogram', url: '#', difficulty: 'Hard' },
      { id: 'sliding-window-maximum', name: 'Sliding Window maximum', url: '#', difficulty: 'Hard' },
      { id: 'min-stack', name: 'Implement Min Stack', url: '#', difficulty: 'Medium' },
      { id: 'rotten-oranges', name: 'Rotten Oranges (Using BFS)', url: '#', difficulty: 'Medium' },
      { id: 'stock-span-problem', name: 'Stock Span Problem', url: '#', difficulty: 'Medium' },
      { id: 'celebrity-problem', name: 'Find the maximum of minimums of every window size', url: '#', difficulty: 'Hard' },
      { id: 'online-stock-span', name: 'The Celebrity Problem', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'String',
    problems: [
      { id: 'reverse-words-in-string', name: 'Reverse Words in a String', url: '#', difficulty: 'Medium' },
      { id: 'longest-palindrome', name: 'Longest Palindrome in a string', url: '#', difficulty: 'Medium' },
      { id: 'roman-to-integer', name: 'Roman Number to Integer', url: '#', difficulty: 'Easy' },
      { id: 'implement-atoi', name: 'Implement ATOI/STRSTR', url: '#', difficulty: 'Medium' },
      { id: 'longest-common-prefix', name: 'Longest Common Prefix', url: '#', difficulty: 'Easy' },
      { id: 'rabin-karp', name: 'Rabin Karp', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'String Part-II',
    problems: [
      { id: 'z-function', name: 'Z-Function', url: '#', difficulty: 'Hard' },
      { id: 'kmp-algorithm', name: 'KMP Algorithm', url: '#', difficulty: 'Hard' },
      { id: 'minimum-characters-palindrome', name: 'Minimum characters needed to be inserted in the beginning to make it palindromic', url: '#', difficulty: 'Hard' },
      { id: 'check-anagrams', name: 'Check for Anagrams', url: '#', difficulty: 'Easy' },
      { id: 'count-say', name: 'Count and Say', url: '#', difficulty: 'Medium' },
      { id: 'compare-version', name: 'Compare version numbers', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Binary Tree',
    problems: [
      { id: 'inorder-traversal', name: 'Inorder Traversal', url: '#', difficulty: 'Easy' },
      { id: 'preorder-traversal', name: 'Preorder Traversal', url: '#', difficulty: 'Easy' },
      { id: 'postorder-traversal', name: 'Postorder Traversal', url: '#', difficulty: 'Easy' },
      { id: 'morris-inorder', name: 'Morris Inorder Traversal', url: '#', difficulty: 'Hard' },
      { id: 'morris-preorder', name: 'Morris Preorder Traversal', url: '#', difficulty: 'Hard' },
      { id: 'left-view-of-tree', name: 'LeftView Of Binary Tree', url: '#', difficulty: 'Medium' },
      { id: 'bottom-view-of-tree', name: 'Bottom View of Binary Tree', url: '#', difficulty: 'Medium' },
      { id: 'top-view-of-tree', name: 'Top View of Binary Tree', url: '#', difficulty: 'Medium' },
      { id: 'preorder-inorder-postorder-in-one-traversal', name: 'Preorder Inorder Postorder in a single traversal', url: '#', difficulty: 'Hard' },
      { id: 'vertical-order-traversal', name: 'Vertical order traversal', url: '#', difficulty: 'Hard' },
      { id: 'root-to-node-path', name: 'Root to node path in a Binary Tree', url: '#', difficulty: 'Medium' },
      { id: 'max-width-binary-tree', name: 'Maximum width of a Binary Tree', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Binary Tree Part-II',
    problems: [
      { id: 'level-order-traversal', name: 'Level order Traversal', url: '#', difficulty: 'Medium' },
      { id: 'height-of-binary-tree', name: 'Height of a Binary Tree', url: '#', difficulty: 'Easy' },
      { id: 'diameter-of-binary-tree', name: 'Diameter of Binary Tree', url: '#', difficulty: 'Medium' },
      { id: 'check-balanced-binary-tree', name: 'Check if the Binary tree is height-balanced', url: '#', difficulty: 'Easy' },
      { id: 'lca-in-binary-tree', name: 'LCA in Binary Tree', url: '#', difficulty: 'Medium' },
      { id: 'check-identical-trees', name: 'Check if two trees are identical', url: '#', difficulty: 'Easy' },
      { id: 'zigzag-traversal', name: 'Zig Zag Traversal of Binary Tree', url: '#', difficulty: 'Medium' },
      { id: 'boundary-traversal', name: 'Boundary Traversal of Binary Tree', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Binary Tree Part-III',
    problems: [
      { id: 'maximum-path-sum', name: 'Maximum path sum', url: '#', difficulty: 'Hard' },
      { id: 'construct-bt-from-inorder-preorder', name: 'Construct Binary Tree from Inorder and Preorder', url: '#', difficulty: 'Medium' },
      { id: 'construct-bt-from-inorder-postorder', name: 'Construct Binary Tree from Inorder and Postorder', url: '#', difficulty: 'Medium' },
      { id: 'symmetric-binary-tree', name: 'Symmetric Binary Tree', url: '#', difficulty: 'Easy' },
      { id: 'flatten-binary-tree-to-linked-list', name: 'Flatten Binary Tree to LinkedList', url: '#', difficulty: 'Medium' },
      { id: 'check-if-mirror', name: 'Check if Binary Tree is the mirror of itself', url: '#', difficulty: 'Easy' },
      { id: 'check-children-sum-property', name: 'Check for Children Sum Property', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Binary Search Tree',
    problems: [
      { id: 'populate-next-right-pointers', name: 'Populate Next Right pointers of Tree', url: '#', difficulty: 'Medium' },
      { id: 'search-in-bst', name: 'Search given Key in BST', url: '#', difficulty: 'Easy' },
      { id: 'construct-bst-from-preorder', name: 'Construct BST from given keys', url: '#', difficulty: 'Medium' },
      { id: 'check-if-bst', name: 'Check is a BT is BST or not', url: '#', difficulty: 'Medium' },
      { id: 'lca-in-bst', name: 'Find LCA of two nodes in BST', url: '#', difficulty: 'Medium' },
      { id: 'find-inorder-predecessor-successor', name: 'Find the inorder predecessor/successor of a given Key in BST', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Binary Search Tree Part-II',
    problems: [
      { id: 'floor-in-bst', name: 'Floor in a BST', url: '#', difficulty: 'Medium' },
      { id: 'ceil-in-bst', name: 'Ceil in a BST', url: '#', difficulty: 'Medium' },
      { id: 'kth-smallest-bst', name: 'Find K-th smallest element in BST', url: '#', difficulty: 'Medium' },
      { id: 'kth-largest-bst', name: 'Find K-th largest element in BST', url: '#', difficulty: 'Medium' },
      { id: 'two-sum-in-bst', name: 'Find a pair with a given sum in BST', url: '#', difficulty: 'Easy' },
      { id: 'bst-iterator', name: 'BST iterator', url: '#', difficulty: 'Medium' },
      { id: 'size-of-largest-bst', name: 'Size of largest BST in a Binary Tree', url: '#', difficulty: 'Hard' },
      { id: 'serialize-deserialize-binary-tree', name: 'Serialize and deserialize Binary Tree', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Binary Trees [Miscellaneous]',
    problems: [
      { id: 'binary-tree-to-double-linked-list', name: 'Binary Tree to Double Linked List', url: '#', difficulty: 'Hard' },
      { id: 'find-median-in-stream', name: 'Find median in a stream of running integers', url: '#', difficulty: 'Hard' },
      { id: 'k-th-largest-element-stream', name: 'K-th largest element in a stream', url: '#', difficulty: 'Easy' },
      { id: 'distinct-numbers-in-window', name: 'Distinct numbers in Window', url: '#', difficulty: 'Hard' },
      { id: 'k-th-largest-element-unsorted', name: 'K-th largest element in an unsorted array', url: '#', difficulty: 'Medium' },
      { id: 'flood-fill-algorithm', name: 'Flood-fill Algorithm', url: '#', difficulty: 'Easy' }
    ]
  },
  {
    name: 'Graph',
    problems: [
      { id: 'clone-graph', name: 'Clone a graph', url: '#', difficulty: 'Medium' },
      { id: 'dfs-of-graph', name: 'DFS', url: '#', difficulty: 'Easy' },
      { id: 'bfs-of-graph', name: 'BFS', url: '#', difficulty: 'Easy' },
      { id: 'detect-cycle-undirected-graph-bfs', name: 'Detect A cycle in Undirected Graph using BFS', url: '#', difficulty: 'Medium' },
      { id: 'detect-cycle-undirected-graph-dfs', name: 'Detect A cycle in Undirected Graph using DFS', url: '#', difficulty: 'Medium' },
      { id: 'detect-cycle-directed-graph-dfs', name: 'Detect A cycle in a Directed Graph using DFS', url: '#', difficulty: 'Medium' },
      { id: 'detect-cycle-directed-graph-bfs', name: 'Detect A cycle in a Directed Graph using BFS', url: '#', difficulty: 'Medium' },
      { id: 'topological-sort', name: 'Topological Sort', url: '#', difficulty: 'Medium' },
      { id: 'number-of-islands', name: 'Number of islands', url: '#', difficulty: 'Medium' },
      { id: 'bipartite-check', name: 'Bipartite Check', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Graph Part-II',
    problems: [
      { id: 'strongly-connected-components', name: 'Strongly Connected Component (kosaraju)', url: '#', difficulty: 'Hard' },
      { id: 'dijkstra-algorithm', name: 'Dijkstra\'s Algorithm', url: '#', difficulty: 'Medium' },
      { id: 'bellman-ford', name: 'Bellman-Ford Algorithm', url: '#', difficulty: 'Medium' },
      { id: 'floyd-warshall', name: 'Floyd Warshall Algorithm', url: '#', difficulty: 'Hard' },
      { id: 'mst-prim', name: 'MST using Prim\'s Algorithm', url: '#', difficulty: 'Medium' },
      { id: 'mst-kruskal', name: 'MST using Kruskal\'s Algorithm', url: '#', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Dynamic Programming',
    problems: [
      { id: 'max-product-subarray', name: 'Max Product Subarray', url: '#', difficulty: 'Medium' },
      { id: 'longest-increasing-subsequence', name: 'Longest Increasing Subsequence', url: '#', difficulty: 'Medium' },
      { id: 'longest-common-subsequence', name: 'Longest Common Subsequence', url: '#', difficulty: 'Medium' },
      { id: '0-1-knapsack', name: '0-1 Knapsack', url: '#', difficulty: 'Medium' },
      { id: 'edit-distance', name: 'Edit Distance', url: '#', difficulty: 'Hard' },
      { id: 'maximum-sum-increasing-subsequence', name: 'Maximum sum increasing subsequence', url: '#', difficulty: 'Medium' },
      { id: 'matrix-chain-multiplication', name: 'Matrix Chain Multiplication', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Dynamic Programming Part-II',
    problems: [
      { id: 'minimum-path-sum', name: 'Minimum path sum', url: '#', difficulty: 'Medium' },
      { id: 'coin-change', name: 'Coin change', url: '#', difficulty: 'Medium' },
      { id: 'subset-sum', name: 'Subset Sum', url: '#', difficulty: 'Medium' },
      { id: 'rod-cutting', name: 'Rod Cutting', url: '#', difficulty: 'Medium' },
      { id: 'egg-dropping', name: 'Egg Dropping', url: '#', difficulty: 'Hard' },
      { id: 'word-break', name: 'Word Break', url: '#', difficulty: 'Medium' },
      { id: 'palindrome-partitioning-dp', name: 'Palindrome Partitioning', url: '#', difficulty: 'Hard' },
      { id: 'maximum-profit-in-job-scheduling', name: 'Maximum profit in Job scheduling', url: '#', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Trie',
    problems: [
      { id: 'implement-trie', name: 'Implement Trie (Prefix Tree)', url: '#', difficulty: 'Medium' },
      { id: 'implement-trie-ii', name: 'Implement Trie II', url: '#', difficulty: 'Hard' },
      { id: 'longest-string-with-all-prefixes', name: 'Longest String with All Prefixes', url: '#', difficulty: 'Medium' },
      { id: 'number-of-distinct-substrings', name: 'Number of Distinct Substrings in a String', url: '#', difficulty: 'Medium' },
      { id: 'power-set', name: 'Power Set', url: '#', difficulty: 'Medium' },
      { id: 'maximum-xor-of-two-numbers', name: 'Maximum XOR of Two Numbers in an Array', url: '#', difficulty: 'Hard' },
      { id: 'maximum-xor-with-element-from-array', name: 'Maximum XOR With an Element From Array', url: '#', difficulty: 'Hard' }
    ]
  }
];
