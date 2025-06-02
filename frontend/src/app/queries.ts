import { gql } from "@apollo/client";

export const GET_NOODLES = gql`
  query GetNoodles($where: InstantNoodleWhereInput) {
  instantNoodles(where: $where) {
    id
    name
    spicinessLevel
    originCountry
  }
}
`;

