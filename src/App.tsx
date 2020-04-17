/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Container, Typography, useTheme } from '@material-ui/core'
import { Route, Switch, useLocation } from 'react-router-dom'
import StartContestView from './components/StartContestView'
import ContestOwnerView from './components/ContestOwnerView'
import ContestPublicView from './components/ContestPublicView'

const App = () => {
  const { spacing, palette } = useTheme()
  const location = useLocation()

  return (
    <div css={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container
        maxWidth="md"
        disableGutters
        css={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Switch location={location}>
          <Route path="/c/owner/:contestId">
            <ContestOwnerView />
          </Route>
          <Route path="/c/:publicContestId">
            <ContestPublicView />
          </Route>
          <Route path="*">
            <StartContestView />
          </Route>
        </Switch>
      </Container>
      <footer>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          css={{
            padding: spacing(3, 2),
            marginTop: 'auto',
            backgroundColor:
              palette.type === 'light' ? palette.grey[200] : palette.grey[800],
          }}
        >
          {new Date().getFullYear()} © Created with ⚡️ by the ETI GDL club.
        </Typography>
      </footer>
    </div>
  )
}

export default App
