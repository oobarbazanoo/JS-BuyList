/**
 * Created by User on 02.02.2017.
 */
$(function()
{

    //region often used variables
    var htmlForProduct = $(".product").html(),
        $addNewProductButt = $(".addNewProductButt"),
        $backInvisibleHouseCommoditiesInfo = $(".backInvisibleHouseCommoditiesInfo"),
        $productNameInput = $("#prodInput"),
        $body = $("body");
    //endregion

    //region change name of the product
    /*5. Редагування назви. В не купленого товару має бути можливість редагувати назву. Коли користувач
     натискає на назву товара, вона має замінятися полем вводу в якому стоїть активний курсор. Після того,
     як користувач знімає фокус з поля, поле редагування має зникнути (input), а замість нього має з’явитися відредагована назва.
     */
    // function changeName()
    // {
    //     var $right = $(this).parent();
    //     $right.addClass("showInput");           STOPPED HEREEEE!!!!!
    // }
    // $(".textInProdInfo").click(changeName);

    //endregion

    //region bought and not bought butts reaction
    /*4. Кнопка відмітити товар як куплений. У кожного НЕ купленого товара має бути кнопка зробити товар купленим.
     Після натискання на неї товар відмічається як куплений: Назва товару стає перекресленою, зникають кнопки
     редагування кількості та кнопка видалення. Якщо користувач натисне кнопку "Зробити не купленим" товар має
     повернутися в попередній стан.*/
    function boughtButtClicked()
    {
        var $divParent = $(this).parent().parent().parent();
        $divParent.fadeOut(1000, function(){$divParent.addClass("boughtButtClicked");});
        $divParent.fadeIn(2000);
    }
    $(".boughtButt").click(boughtButtClicked);

    function notBoughtButtClicked()
    {
        var $divParent = $(this).parent().parent().parent();
        $divParent.fadeOut(1000, function(){$divParent.removeClass("boughtButtClicked");});
        $divParent.fadeIn(2000);
    }
    $(".notBoughtButt").click(notBoughtButtClicked);


    //endregion

    //region cancel butt reaction
    /*3. Кнопка видалити. У кожного НЕ купленого товара має бути кнопка
     видалення. Після натискання кнопки товар має зникати зі
     списка. (В товара який відмічений як купление кнопки видалення не має бути)
     */
    function deleteButtClicked()
    {
        var $divParent = $(this).parent().parent().parent();
        $divParent.hide(1000, function(){$divParent.remove();});
    }
    $(".deleteButt").click(deleteButtClicked);
    //endregion

    //region add product part
    /* 1. Додавання товару. Користувач має мати можливість ввести назву товара в поле вводу та натиснути кнопку
      Додати. Після натискання кнопки додати (або клавіші Enter) товар має бути
      доданим в кінець списку. Поле вводу має стати порожнім, а курсор залишитись в полі вводу.  */
    //additionally: user can`t enter only spaces, will be notified about this and focus will be returned into input, input will be cleared
    function addProduct()
    {
            //take name in input, take inwards, trim name, write name into inwards
            var nameOfTheCommodity = $productNameInput.val(),
                $prodInwards = $(htmlForProduct);
            nameOfTheCommodity = $.trim(nameOfTheCommodity);
            $prodInwards.find(".textInProdInfo").text(nameOfTheCommodity);

            //check whether name is not blank
            if(nameOfTheCommodity.length < 1)
            {
                alert("The name is blank!");
                $productNameInput.val("");
                $productNameInput.focus();
                return;
            }

            //create full product div
            var $productDiv = $("<div/>");
            $productDiv.addClass("product");
            $productDiv.append($prodInwards);

            //add div to the scene
            $backInvisibleHouseCommoditiesInfo.append($productDiv);

            //set action listener for newly created cancel button
            $productDiv.find(".deleteButt").click(deleteButtClicked);

            //set action listener for newly created bought button
            $productDiv.find(".boughtButt").click(boughtButtClicked);

            //set action listener for newly created not bought button
            $productDiv.find(".notBoughtButt").click(notBoughtButtClicked);

            //clear input area and move focus back
            $productNameInput.val("");
            $productNameInput.focus();
    }

    function mouseDownAddNewProductButt()
    {
        $addNewProductButt.addClass(".buttonClicked");
    }

    //add button reaction
    $addNewProductButt.click(addProduct);
    $addNewProductButt.mousedown(mouseDownAddNewProductButt);

    //enter reaction
    $.fn.pressEnter = function(fn) {

        return this.each(function() {
            $(this).bind('enterPress', fn);
            $(this).keyup(function(e){
                if(e.keyCode == 13)
                {
                    $(this).trigger("enterPress");
                }
            })
        });
    };
    $productNameInput.pressEnter(addProduct);

    /* 1. Додавання товару. Користувач має мати можливість ввести назву товара в поле вводу та натиснути кнопку
     Додати. Після натискання кнопки додати (або клавіші Enter) товар має бути
     доданим в кінець списку. Поле вводу має стати порожнім, а курсор залишитись в полі вводу.  */
    //endregion

    //region background-image changing over time body
    function getRandomInt(min, max)
    {return Math.floor(Math.random()*(max-min+1))+min;}

    function nextBackground()
    {
        var url = "url('images/" + getRandomInt(1, 33) + ".jpg')";
        // $body.fadeOut(2000, function ()
        // {
        //     $body.css("background-image", url).fadeIn(2000);
        // });

        $body.css("background-image", url);
        setTimeout(nextBackground, 7000);
    }
    setTimeout(nextBackground, 7000);
    //endregion

    //region play music in background
    window.onload = function()
    {
        playSong();
    }

    function playSong()
    {
        var song = new Audio();
        song.src = "music/" + getRandomInt(1, 2) + ".mp3";
        song.play();
        song.onended = playSong;
    }
    //endregion

});