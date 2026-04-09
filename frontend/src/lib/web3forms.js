const WEB3FORMS_ACCESS_KEY = '7658ae31-0a04-4fbf-b3a0-26b3dded800d'

async function submitWeb3Form({
  subject,
  fromName,
  replyTo,
  fields,
}) {
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject,
    from_name: fromName,
    replyto: replyTo,
    ...fields,
  }

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || 'We could not submit your form right now. Please try again.',
    )
  }

  return result
}

export { submitWeb3Form }
