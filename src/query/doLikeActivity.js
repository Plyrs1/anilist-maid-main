module.exports = `mutation{
    like1: ToggleLikeV2(id:426653731, type:ACTIVITY) {
        ... on ListActivity {
          user {
            name
          }
          isLiked
          likeCount
      }
        ... on TextActivity {
          user {
            name
          }
          isLiked
          likeCount
      }
    }
    like2: ToggleLikeV2(id:426810471, type:ACTIVITY) {
        ... on ListActivity {
          user{
            id
            name
            isFollowing
            isFollower
          }
          isLiked
          likeCount
      }
        ... on TextActivity {
          user{
            id
            name
            isFollowing
            isFollower
          }
          isLiked
          likeCount
      }
    }
      like3: ToggleLikeV2(id:426801167, type:ACTIVITY) {
        ... on ListActivity {
          user{
            id
            name
            isFollowing
            isFollower
          }
          isLiked
          likeCount
      }
        ... on TextActivity {
          user{
            id
            name
            isFollowing
            isFollower
          }
          isLiked
          likeCount
      }
    }
  }
`
