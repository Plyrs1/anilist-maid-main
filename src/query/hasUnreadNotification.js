module.exports = `
query {
  Viewer{
    id
    name
    avatar {
      medium
    }
    unreadNotificationCount
  }
}
`