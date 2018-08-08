import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';

import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { graphql, ApolloProvider, compose } from 'react-apollo';
// import * as AWS from 'aws-sdk';
import AppSync from './AppSync.js';

import AllTransactionsQuery from './Queries/AllTransactionsQuery.js';
import NewTransactionSubscription from './Queries/NewTransactionSubscription.js';

const client = new AWSAppSyncClient({
  url: AppSync.graphqlEndpoint,
  region: AppSync.region,
  auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: AppSync.apiKey,
  },
  options: {
    fetchPolicy: 'cache-and-network'
  },
  disableOffline:false  
}); 


class App extends Component {
  render() {
    return (
      <div className="">
        <table className="ui celled table">
          <thead>
            <tr><th>Transaction ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr></thead>
          <tbody>
            <ListAllTransactions />
          </tbody>
          <tfoot>
            <tr><th colSpan="3">
              <div className="ui right floated pagination menu">
                <a className="icon item">
                  <i className="left chevron icon"></i>
                </a>
                <a className="item">1</a>
                <a className="item">2</a>
                <a className="item">3</a>
                <a className="item">4</a>
                <a className="icon item">
                  <i className="right chevron icon"></i>
                </a>
              </div>
            </th>
          </tr></tfoot>
        </table>
      </div>
    );
  }
}

const Transaction = props => {
  return (
    <tr>
      <td>{props.item.transcation_id}</td>
      <td>{props.item.name}</td>
      <td>{props.item.email}</td>
  </tr>
  )
}

class Transactions extends Component {
  componentWillMount() {
    this.props.subscribeToTransactions()
  }
  render() {
    return (
      this.props.transactions.map(((item, index)=>{
        return (
          <Transaction item={item} key={item.transcation_id}/>
        )
      }))
    )
  }
}

const ListAllTransactions = compose(
  graphql(AllTransactionsQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: (props) => ({
      transactions: props.data.listTransactions ? props.data.listTransactions : [],
      subscribeToTransactions: params => {
        props.data.subscribeToMore({
          document: NewTransactionSubscription,
          updateQuery: (previousResult, {subscriptionData, variables}) => {
            console.log(previousResult);

            var newTransaction = subscriptionData.data.addTransaction;
            console.log(newTransaction)

            const newObj = {}
            newObj.listTransactions = [newTransaction, ...previousResult.listTransactions];
            console.log(newObj);

            return newObj;
          }
        })
      }
    })
  })
)(Transactions)

const WithProvider = () => {
  return (
    <ApolloProvider client={client}>
      <Rehydrated>
        <App />
      </Rehydrated>
    </ApolloProvider>
  )
}

export default WithProvider;
