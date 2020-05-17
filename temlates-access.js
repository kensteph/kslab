if (typeof req.session.UserData != "undefined") {
    if (req.session.UserData.user_menu_access.includes("Tableau de bord") || req.session.UserData.user_menu_access[0] == "All") {
      /// FULL ACCESS
      //ADD LINE TO PARAMETERS
      UserData : req.session.UserData,
    } else {
        res.redirect(global.USER_HOME_PAGE);
    }

} else {
    res.redirect("/");
}



//SUB MENU
if (typeof req.session.UserData != "undefined") {
    if (req.session.UserData.user_sub_menu_access.includes("Tableau de bord") || req.session.UserData.user_sub_menu_access[0] == "All") {
      /// FULL ACCESS
      //ADD LINE TO PARAMETERS
      UserData : req.session.UserData,
    } else {
        res.redirect(global.USER_HOME_PAGE);
    }

} else {
    res.redirect("/");
}
