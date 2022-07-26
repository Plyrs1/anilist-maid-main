module.exports = `
query ($page:Int, $resetNotificationCount:Boolean = false){
  Page(page:$page, perPage:50){
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    notifications(resetNotificationCount:$resetNotificationCount, type_in: [ACTIVITY_MESSAGE, ACTIVITY_LIKE, ACTIVITY_MENTION,ACTIVITY_REPLY,ACTIVITY_REPLY_SUBSCRIBED,FOLLOWING]) {
      ... on ActivityMessageNotification {
        activityId
        type
        user {
          id
          name
          avatar {
            medium
          }
          isFollowing
          isFollower
        }
      }
      ... on ActivityLikeNotification {
        activityId
        type
        user {
          id
          name
          avatar {
            medium
          }
          isFollowing
          isFollower
        }
      }
      ... on ActivityMentionNotification {
        activityId
        type
        user {
          id
          name
          avatar {
            medium
          }
          isFollowing
          isFollower
        }
      }
      ... on ActivityReplyNotification {
        activityId
        type
        user {
          id
          name
          avatar {
            medium
          }
          isFollowing
          isFollower
        }
      }
      
      ... on ActivityReplySubscribedNotification {
        activityId
        type
        user {
          id
          name
          avatar {
            medium
          }
          isFollowing
          isFollower
        }
      }
      ... on FollowingNotification {
        id
        type
        user {
          id
          name
          avatar {
            medium
          }
          isFollowing
          isFollower
        }
      }
    }
  }
}
`