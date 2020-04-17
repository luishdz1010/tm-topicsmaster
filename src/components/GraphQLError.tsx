/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FC } from 'react'
import { ApolloError } from 'apollo-client'
import { Alert, AlertTitle } from '@material-ui/lab'
import { Grow } from '@material-ui/core'

const GraphQLError: FC<{ error: ApolloError | undefined }> = ({
  error,
  ...props
}) =>
  error ? (
    <Grow in={true}>
      <Alert
        severity="error"
        css={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          textAlign: 'left',
          wordBreak: 'break-word',
        }}
        {...props}
      >
        <AlertTitle>Error</AlertTitle>
        {error?.graphQLErrors.map(({ message }, i) => (
          <span key={i}>
            {message.charAt(0).toUpperCase() + message.slice(1)}
          </span>
        ))}
        {!error && 'Unknown error'}
      </Alert>
    </Grow>
  ) : null

export default GraphQLError
