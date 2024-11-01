export interface IUserRole {
  createdAt?: number | null; // Float
  group: string; // String!
  groupID: string; // String!
  groupType: string; // String!
  id?: string | null; // ID
  isPrimaryOwner?: boolean | null; // Boolean
  lockerRoomID: string; // String!
  role: string; // String!
  status: string; // String!
  uid: string; // String!
  updatedAt?: number | null; // Float
  userID: string; // String!
}
