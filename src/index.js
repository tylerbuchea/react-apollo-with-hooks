import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import {
  ApolloProvider as ApolloHooksProvider,
  useQuery,
} from 'react-apollo-hooks';

const client = new ApolloClient({
  uri: 'https://graphql-pokemon.now.sh/graphql',
});

const GET_POKEMONS = gql(`
  query getPokemons {
    pokemons(first: 10) {
      name
    }
  }
`);

// This is the new way using React Hooks and Suspense
function NewWay() {
  const { data, error } = useQuery(GET_POKEMONS);
  if (error) return <div>Error</div>;
  return (
    <ul>
      <h2>NEW WAY</h2>
      {data.pokemons.map((pokemon, index) => (
        <li key={index}>{pokemon.name}</li>
      ))}
    </ul>
  );
}

// This is the old way using render props
class OldWay extends React.Component {
  renderContent = ({ data, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;
    return (
      <ul>
        <h2>OLD WAY</h2>
        {data.pokemons.map((pokemon, index) => (
          <li key={index}>{pokemon.name}</li>
        ))}
      </ul>
    );
  };

  render() {
    return <Query query={GET_POKEMONS}>{this.renderContent}</Query>;
  }
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Suspense fallback={<div>Loading...</div>}>
        <NewWay />
      </Suspense>
    </ApolloHooksProvider>
    <OldWay />
  </ApolloProvider>,
  document.getElementById('root')
);
