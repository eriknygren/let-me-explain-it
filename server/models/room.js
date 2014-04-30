var orm = require("../orm")
    , Seq = orm.Seq();

module.exports = {
    model:{
        id: Seq.STRING,
        name: Seq.STRING
    },
    relations:{
        //hasOne: (user, {as: 'author'})
    },
    options:{
        freezeTableName: true,
        timestamps: false
    }
}