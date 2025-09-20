export const BOARD_LIST = ["CBSE", "ICSE", "HP"] as const;

export const STATE_LIST = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export const DEFAULT_TAB = "All Classes"
export const CLASS_GROUPS = new Map<string, Array<string>>([
  ["Senior Secondary", ["11", "12"]],
  ["Secondary", ["9", "10"]],
  ["Middle", ["6", "7", "8"]],
  ["Primary", ["1", "2", "3", "4", "5"]],
  ["Pre Primary", ["LKG", "UKG", "Nursery", "Pre Nursery"]],
]);

export type Board = (typeof BOARD_LIST)[number];
export type IndianState = (typeof STATE_LIST)[number];

export const CONCESSIONS = [
  { id: "none", title: "No Concession", value: 0 },
  { id: "50", title: "50% Concession", value: 50 },
  { id: "25", title: "25% Concession", value: 25 },
  { id: "10", title: "10% Concession", value: 10 },
];
