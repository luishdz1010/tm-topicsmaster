/** @jsx jsx */
import { jsx } from '@emotion/core'
import { ContestPublicProjection } from '../types'
import { FC, Fragment, useLayoutEffect, useState } from 'react'
import { Box, Typography } from '@material-ui/core'
import Winners from './Winners'

const PublicWinners: FC<{
  contest: ContestPublicProjection
  refetchContest: () => void
}> = ({ contest, refetchContest }) => {
  const [counter, setCounter] = useState<string | null>(null)
  const embargoLiftTime = Date.parse(contest.statusChangedAt) + 60 * 60 * 1000
  const winners = contest.winners

  useLayoutEffect(() => {
    if (winners) return undefined

    const update = () => {
      const rightNow = new Date().getTime()
      let diff = embargoLiftTime - rightNow

      if (diff <= 0) {
        setCounter('...')
        refetchContest()
        return
      }

      diff = Math.round(diff / 1000)

      const d = Math.floor(diff / (24 * 60 * 60))
      diff = diff - d * 24 * 60 * 60
      const h = Math.floor(diff / (60 * 60))
      diff = diff - h * 60 * 60
      const m = Math.floor(diff / 60)
      diff = diff - m * 60

      setCounter(`${h > 0 ? `${h}:` : ''}${m}:${diff}`)
    }

    const handle = setInterval(update, 1000)

    update()

    return () => clearInterval(handle)
  }, [embargoLiftTime, refetchContest, winners])

  return contest.winners ? (
    <Winners winners={contest.winners} />
  ) : (
    <Fragment>
      <Typography variant="h5" gutterBottom>
        The contest has ended.
      </Typography>
      <Typography gutterBottom>
        {' '}
        Winners will be displayed here in...
      </Typography>

      <Typography variant="h2" component="span">
        {counter}
      </Typography>
    </Fragment>
  )
}

export default PublicWinners
