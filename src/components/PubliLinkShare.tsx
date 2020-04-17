/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Box, Button, Typography } from '@material-ui/core'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FC } from 'react'
import { useSnackbar } from 'notistack'

const PublicLinShare: FC<{ publicId: string }> = ({ publicId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const publicLink = `${window.location.origin}/c/${publicId}`

  return (
    <Box display="flex" flex="none" flexDirection={{ xs: 'column', sm: 'row' }} marginBottom={4}>
      <Box
        flex={1}
        marginBottom={{ xs: 2, sm: 0 }}
        marginRight={{ xs: 0, sm: 2 }}
      >
        <Typography>
          Share this link with all members and guests attending the meeting:{' '}
          <br />
          <a
            href={publicLink}
            target="_blank"
            rel="noopener noreferrer"
            css={{ wordBreak: 'break-all' }}
          >
            {publicLink}
          </a>
        </Typography>
      </Box>

      <CopyToClipboard
        text={publicLink}
        onCopy={() =>
          enqueueSnackbar('Shareable link copied to your clipboard')
        }
      >
        <Button
          variant="outlined"
          color="primary"
          css={{ minWidth: 'max-content', margin: 'auto 0' }}
        >
          Copy to clipboard
        </Button>
      </CopyToClipboard>
    </Box>
  )
}

export default PublicLinShare
