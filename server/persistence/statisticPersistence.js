var orm = require('../orm');

exports.addStatistic = function (parameters, callback)
{
    var statisticModel = orm.model('statistic');

    statisticModel.build(
        {
            start_date_time: parameters.startDateTime,
            total_duration: parameters.totalDuration,
            draw_tab_duration: parameters.drawTabDuration,
            map_tab_duration: parameters.mapTabDuration,
            voice_chat_duration: parameters.voiceChatDuration,
            map_follow_feature_duration: parameters.mapFollowFeatureDuration,
            chat_messages_sent: parameters.chatMessagesSent,
            map_markers_added: parameters.mapMarkersAdded,
            registered: parameters.registered,
            max_users_in_room: parameters.maxUsersInRoom
        }).save().error(function(err)
        {
            return callback(err);

        }).success(function(result)
        {
            return callback(null);
        });
}