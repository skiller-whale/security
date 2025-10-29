import { useState } from 'react';

const ALLOWED_EMAILS = [
  "alice@example.com",
  "bob@example.com"
]

function Controls() {
    const [controlsDisabled, setControlsDisabled] = useState(false)
    const [email, setEmail] = useState('')
    const [submittedEmail, setSubmittedEmail] = useState('')
    const [controlState, setControlState] = useState('input')

    function submitForm(e) {
      e.preventDefault();

      if (email.length == 0) {
        return;        
      }

      setSubmittedEmail(email)
      if (ALLOWED_EMAILS.includes(email)) {
        setControlState('success')
      } else {
        setControlState('fail')
      }
    }

    function infoMessage() {
      switch(controlState) {
        case 'input':
          return (
            <div className="info">
              Please enter the email you used when registering your account.
            </div>
          )
        case 'success':
          return (
            <div className="success">
              A recovery email has been sent to <strong>{submittedEmail}</strong>.
            </div>
          )
        case 'fail':
          return (
            <div className="error">
              No user found for <strong>{submittedEmail}</strong>.
            </div>
          )
      }
    }

    return (
        <div className="controls">
          {infoMessage()}
            
          <form className="password-recovery" method="post" onSubmit={submitForm}>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
              name="username-email" type="text"
              className="username-email" placeholder="Email Address"
            />
            <button type="submit" disabled={controlsDisabled}>Reset Password</button>
          </form>
        </div>
    )
}

export default Controls
