const clientInterface = {
    id: Date.now(),
    firstName: '',
    lastName: '',
    companyName: '',
    date: new Date().toISOString().slice(0, 10),
    coordonnees: {
        firstAddress: '',
        secondAddress: '',
        codePostal: '',
        ville: '',
        pays: ''
      },
}

export { clientInterface }
