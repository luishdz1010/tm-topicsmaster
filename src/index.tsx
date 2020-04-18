import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import awsconfig from './aws-exports'
import { ApolloProvider } from 'react-apollo'
import {
  AUTH_TYPE,
  default as AWSAppSyncClient,
  defaultDataIdFromObject,
} from 'aws-appsync'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  disableOffline: true,
  cacheOptions: {
    dataIdFromObject: (object: any) => {
      switch (object.__typename) {
        case 'Contest':
          return object.publicId
        case 'ContestVote':
          return `${object.contestPublicId}:${object.voterName}_${object.createdAt}`
        default:
          return defaultDataIdFromObject(object)
      }
    },
  },
})

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004165',
    },
    secondary: {
      main: '#CD202C',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider>
      <BrowserRouter>
        <CssBaseline />
        <ApolloProvider client={client as any}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
