var orm = require("../orm")
    , Seq = orm.Seq();

module.exports = {
    model:{
        id: Seq.STRING,
        room_id: Seq.STRING,
        user_id: Seq.INTEGER
    },
    relations:{
        //hasOne: (user, {as: 'author'})
    },
    options:{
        freezeTableName: true,
        timestamps: false
    }
}