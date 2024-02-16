export const updateQuestion = (question) => {
    return fetch('http://localhost:8080/eva/qus/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
  