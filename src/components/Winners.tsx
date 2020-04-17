/** @jsx jsx */
import { jsx } from '@emotion/core'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { FC } from 'react'
import { winnerLabels } from '../lib/winner-labels'

const Winners: FC<{ winners: string[] }> = ({ winners }) => (
  <Box
    display="flex"
    width="auto"
    margin="0 auto"
    textAlign="center"
    flexDirection="column"
    alignItems="center"
  >
    <Typography variant="h5">Congratulate the winners! 🐤</Typography>
    <List>
      {winners.map((winner, idx) => (
        <ListItem key={idx}>
          <ListItemAvatar>
            <span
              css={{
                display: 'block',
                transform: 'scale(2.5) translate(37%, 0%)',
              }}
            >
              {winnerLabels?.[idx]?.single}
            </span>
          </ListItemAvatar>
          <ListItemText primary={winner} />
        </ListItem>
      ))}
    </List>
  </Box>
)

export default Winners
