export const updateQuestion = (question) => {

  const userString = sessionStorage.getItem('user');
  const userObject = JSON.parse(userString);
  const accessToken = userObject.accessToken;

  console.log("Access Token:", accessToken);
  return fetch('http://localhost:8080/eva/qus/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(question),
  })
  .then(response => {
    if (response.ok) {
      console.log("this is the reponse of the update ")
      return response.json();
    } else {
      throw new Error('Failed to update question');
    }
  });
};
