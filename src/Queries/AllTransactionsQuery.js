import gql from 'graphql-tag'

export default gql`
query listTransactions{
  listTransactions {
    transcation_id
    name
    email
  }
}`;