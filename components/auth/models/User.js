class User{
    constructor(_id,username,userstatus,usertype,password,name){
        this._id = _id;
        this.username = username;
        this.userstatus = userstatus;
        this.usertype = usertype;
        this.password = password;
        this.name = name;
    }

    toString() {         
        return console.log(JSON.stringify(this));     
    } 

    
}


class UserBuilder{
    constructor(username,userstatus,usertype,password,name){
        this.username = username;
        this.userstatus = userstatus;
        this.usertype = usertype;
        this.password = password;
        this.name = name;
    }

    
}