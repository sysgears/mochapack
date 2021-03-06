import { exec as execProcess } from 'child_process'

export default function exec(command, cb) {
  // eslint-disable-line import/prefer-default-export
  let data = ''
  const ps = execProcess(command, err => {
    cb(err, data !== '' ? data : null)
  })

  ps.stdout.on('data', d => {
    data += d
  })
  ps.stderr.on('data', d => {
    data += d
  })
}
