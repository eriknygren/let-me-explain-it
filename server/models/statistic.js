var orm = require("../orm")
    , Seq = orm.Seq();

module.exports = {
    model:{
        id: {type: Seq.INTEGER, autoIncrement: true},
        start_date_time: Seq.DATE,
        total_duration: Seq.INTEGER,
        draw_tab_duration: Seq.INTEGER,
        map_tab_duration: Seq.INTEGER,
        voice_chat_duration: Seq.INTEGER,
        map_follow_feature_duration: Seq.INTEGER,
        chat_messages_sent: Seq.INTEGER,
        map_markers_added: Seq.INTEGER,
        registered: Seq.BOOLEAN,
        max_users_in_room: Seq.INTEGER
    },
    relations:{
        //hasOne: (user, {as: 'author'})
    },
    options:{
        freezeTableName: true,
        timestamps: false
    }
}