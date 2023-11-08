export type PaginatedObjectTypeEdge<ObjectType extends { id: string }> = {
  node: ObjectType;
  cursor: string;
};

export type PaginatedObjectTypeResults<ObjectType extends { id: string }> = {
  edges: PaginatedObjectTypeEdge<ObjectType>[];
  pageInfo: {
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
  };
};
