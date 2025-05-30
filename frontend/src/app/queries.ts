import { gql } from "@apollo/client";

export const GET_NOODLES = gql`
  query GetNoodles {
    instantNoodles {
      id
      name
    }
  }
`;

export const GET_NOODLES_WITH_FILTERS = gql`
  query GetNoodlesWithFilters {
    instantNoodles {
      id
      name
      spicinessLevel
      originCountry
    }
  }
`;

export const LEAVE_REVIEW = gql`
  mutation LeaveReview($id: ID!) {
    leaveReview(id: $id) {
      id
      reviewsCount
    }
  }
`;