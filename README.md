# anilist-maid-main
This is the main service doing background monitoring of user's profile.
Because I can't find how to get instant notification from AniList, for now I will use polling to get latest notification from AniList
By default, it'll get notification every 30 minutes

Few things that it do :
- Saving likes and comment to the database
- Providing API for the other service to get saved likes and comment for further processing
- Providing stats for user likes and count, including leaderboard
- Wiping database each month and generating monthly report
