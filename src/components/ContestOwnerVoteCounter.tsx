/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FC } from 'react'
import { ContestOwnerProjection } from '../types'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import ContestOwnerWinnerSelection from './ContestOwnerWinnerSelection'
import { ContestStatus } from '../API'
import { winnerLabels } from '../lib/winner-labels'

const ContestOwnerVoteCounter: FC<{
  contest: ContestOwnerProjection
  setLocalWinners: (winners: string[]) => void
}> = ({ contest, setLocalWinners }) => {
  const { speakers, votes } = contest

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <TableContainer css={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" css={{ maxWidth: 160 }}>
                Speaker ↗️ <br />
                Voter ⬇️
              </TableCell>
              {speakers.map(({ id, name }) => (
                <TableCell key={id}>
                  <span
                    css={css`
                      text-orientation: sideways;
                      writing-mode: vertical-rl;
                      transform: rotate(200deg);
                    `}
                  >
                    {name}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {votes?.map(({ voterName, winners }, voteIdx) =>
              winners && winners.length > 0 ? (
                <TableRow key={voteIdx}>
                  <TableCell variant="head">{voterName}</TableCell>

                  {speakers.map(({ id: speakerId }) => {
                    const indexOfWinner = winners.slice(0, 3).indexOf(speakerId)

                    return (
                      <TableCell key={speakerId}>
                        <span
                          css={{
                            display: 'block',
                            fontSize: 20,
                            transform: 'scale(1.5) translateX(-5%)',
                          }}
                        >
                          {indexOfWinner > -1 &&
                            winnerLabels[indexOfWinner].single}
                        </span>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ) : null,
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ContestOwnerWinnerSelection
        isVoting={contest.status === ContestStatus.VOTING}
        contest={contest}
        setLocalWinners={setLocalWinners}
      />
    </Box>
  )
}

export default ContestOwnerVoteCounter
