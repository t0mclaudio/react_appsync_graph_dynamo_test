import gql from 'graphql-tag';

export default gql`
subscription transactionSubscribe {
  addTransaction {
    transcation_id
    name
    email
  }
}`;