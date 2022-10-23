export const getRecipientEmails = (users, userLoogedIn) => {
    return (
        users?.filter(userToFilter => userToFilter !== userLoogedIn.email)[0]
    )
}
