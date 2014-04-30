var orm = require("../orm")
    , Seq = orm.Seq();

module.exports = {
    model:{
        id: {type: Seq.INTEGER, autoIncrement: true},
        name: Seq.STRING,
        email: Seq.STRING,
        password: Seq.STRING,
        picture: Seq.STRING
    },
    relations:{
        //hasOne: (user, {as: 'author'})
    },
    options:{
        freezeTableName: true,
        timestamps: false
    }
}