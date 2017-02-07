/**
 * Created by User on 02.02.2017.
 */
$(function()
{

    //region often used variables and a few tweaks
    var htmlForProduct = $(".product").html(),
        $addNewProductButt = $(".addNewProductButt"),
        $backInvisibleHouseCommoditiesInfo = $(".backInvisibleHouseCommoditiesInfo"),
        $productNameInput = $("#prodInput"),
        $backPicture = $("#backPicture"),
        htmlForProductInTheRightColumn = $(".good").html(),
        $toBuyProducts = $(".toBuyProducts"),
        $alreadBoughtProd = $(".alreadyBoughtProd");

    var ROTATE = 1, RESCALE = 2, ROTATEx = 1, ROTATEy = 2, ROTATEz = 3;
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
    //endregion

    //region change name of the product
    /*5. Редагування назви. В не купленого товару має бути можливість редагувати назву. Коли користувач
     натискає на назву товара, вона має замінятися полем вводу в якому стоїть активний курсор. Після того,
     як користувач знімає фокус з поля, поле редагування має зникнути (input), а замість нього має з’явитися відредагована назва.
     */

    function changeName()
    {
        var $left = $(this).parent();
        if($left.parent().parent().hasClass("boughtButtClicked"))
        {return;}
        $left.find(".changeNameInput").val($left.find(".textInProdInfo").text());
        $left.addClass("showInput");
        $left.find(".changeNameInput").focus();
    }
    $(".textInProdInfo").click(changeName);

    function focusOutFromChangeNameInput()
    {
        var $left = $(this).parent();
        $left.find(".textInProdInfo").text($left.find(".changeNameInput").val());
        $left.removeClass("showInput");
    }
    $(".changeNameInput").focusout(focusOutFromChangeNameInput);
    $(".changeNameInput").pressEnter(focusOutFromChangeNameInput);

    function changeNameDynamically()
    {
        var $mainDiv = $(this).parent().parent().parent(),
            serialNumberChoosen = $mainDiv.index(),
            $divFromLeftColumnToChange = $(".toBuyProducts .good:nth-child(" + serialNumberChoosen + ")");
        $divFromLeftColumnToChange.find(".nameOnRight").text($(this).val());

    }
    $(".changeNameInput").keyup(changeNameDynamically);
    //endregion

    //region bought and not bought butts reaction
    /*4. Кнопка відмітити товар як куплений. У кожного НЕ купленого товара має бути кнопка зробити товар купленим.
     Після натискання на неї товар відмічається як куплений: Назва товару стає перекресленою, зникають кнопки
     редагування кількості та кнопка видалення. Якщо користувач натисне кнопку "Зробити не купленим" товар має
     повернутися в попередній стан.*/
    var counterOfAlreadyBoughtProducts = 0;
    function boughtButtClicked()
    {
        var $divParent = $(this).parent().parent().parent();
        $divParent.fadeOut(1000, function(){$divParent.addClass("boughtButtClicked");});
        $divParent.fadeIn(2000);

        var serialNumberChoosen = $divParent.index(),
            $divFromRightColumnToChange = $(".toBuyProducts .good:nth-child(" + serialNumberChoosen + ")");

        $divFromRightColumnToChange.hide(1000, function(){});

        var $divForAlreadyBoughGood = $("<div>", {"class": "boughtGood"}),
            $divWithName = $("<div>", {"class": "nameOnRight strikeout"}),
            $spanWithNumberOfGoods =  $("<span>", {"class": "numberOfGoods backVisibleStandardColor strikeout"});

        $divWithName.text($divFromRightColumnToChange.find(".nameOnRight").text());
        $spanWithNumberOfGoods.text($divFromRightColumnToChange.find(".numberOfGoods").text());
        $divForAlreadyBoughGood.append($divWithName);
        $divForAlreadyBoughGood.append($spanWithNumberOfGoods);
        $divForAlreadyBoughGood.attr("id", "" + counterOfAlreadyBoughtProducts + "left");
        $divParent.attr("id", "" + counterOfAlreadyBoughtProducts);
        counterOfAlreadyBoughtProducts++;
        $alreadBoughtProd.append($divForAlreadyBoughGood);
    }
    $(".boughtButt").click(boughtButtClicked);

    function notBoughtButtClicked()
    {
        var $divParent = $(this).parent().parent().parent();
        $("#"+$divParent.attr("id")+"left").hide(1000, function(){$("#"+$divParent.attr("id")+"left").remove();});


        $divParent.fadeOut(1000, function(){$divParent.removeClass("boughtButtClicked");});
        $divParent.fadeIn(2000);

        var serialNumberChoosen = $divParent.index(),
            $divFromRightColumnToChange = $(".toBuyProducts .good:nth-child(" + serialNumberChoosen + ")");

        counterOfAlreadyBoughtProducts--;
        $("#"+$divParent.attr("id")+"left").removeAttr("id");
        $divParent.removeAttr("id");

        $divFromRightColumnToChange.fadeIn(1000, function(){});
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

        var serialNumberChoosen = $divParent.index(),
            $divFromRightColumnToChange = $(".toBuyProducts .good:nth-child(" + serialNumberChoosen + ")");
        $divFromRightColumnToChange.hide(1000, function(){$divFromRightColumnToChange.remove();});
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
            $prodInwards = $(htmlForProduct),
            $inwardsForRight = $(htmlForProductInTheRightColumn);
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

        //create full product div for left column
        var $productDiv = $("<div/>");
        $productDiv.addClass("product");
        $productDiv.append($prodInwards);

        //create full product div for left column
        var $productDivRight = $("<div/>");
        $productDivRight.addClass("good");
        $productDivRight.append($inwardsForRight);
        $productDivRight.find(".nameOnRight").text(nameOfTheCommodity);

        //add div to the scene
        $backInvisibleHouseCommoditiesInfo.append($productDiv);

        //add left div to the scene
        $toBuyProducts.append($productDivRight);

        //set action listener for newly created cancel button
        $productDiv.find(".deleteButt").click(deleteButtClicked);

        //set action listener for newly created bought button
        $productDiv.find(".boughtButt").click(boughtButtClicked);

        //set action listener for newly created not bought button
        $productDiv.find(".notBoughtButt").click(notBoughtButtClicked);

        //set action listener for newly created name and change name input
        $productDiv.find(".textInProdInfo").click(changeName);
        $productDiv.find(".changeNameInput").focusout(focusOutFromChangeNameInput);
        $productDiv.find(".changeNameInput").pressEnter(focusOutFromChangeNameInput);
        $productDiv.find(".changeNameInput").keyup(changeNameDynamically);

        //set action listener for add, subtract buttons
        $productDiv.find(".addProdButt").click(addButtonClicked);

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
    $productNameInput.pressEnter(addProduct);

    /* 1. Додавання товару. Користувач має мати можливість ввести назву товара в поле вводу та натиснути кнопку
     Додати. Після натискання кнопки додати (або клавіші Enter) товар має бути
     доданим в кінець списку. Поле вводу має стати порожнім, а курсор залишитись в полі вводу.  */
    //endregion

    //region background-image changing over time body
    function getRandomInt(min, max)
    {return Math.floor(Math.random()*(max-min+1))+min;}

    function getRandomDouble(min, max)
    {return Math.random() * (max - min) + min;}

    function nextBackground()
    {
        var url = "url('images/" + getRandomInt(1, 43) + ".jpg')";

        $backPicture.css("background-image", url);
        setTimeout(nextBackground, 7000);
    }

    function nextEffect()
    {
        switch(getRandomInt(1, 2))
        {
            case ROTATE:
                var degreeToRotate = getRandomInt(360, 1000);
                switch(getRandomInt(1, 3))
                {
                    case ROTATEx:
                        $backPicture.css("transform", "rotateX("+degreeToRotate+"deg)");
                        break;
                    case ROTATEy:
                        $backPicture.css("transform", "rotateY("+degreeToRotate+"deg)");
                        break;
                    case ROTATEz:
                        $backPicture.css("transform", "rotateZ("+degreeToRotate+"deg)");
                        break;
                }
                break;
            case RESCALE:
                var rescaleFactor = getRandomDouble(0, 3);
                $backPicture.css("transform", "scale("+rescaleFactor+")");
                break;
        }
        setTimeout(nextEffect, 7000);
    }
    setTimeout(nextBackground, 7000);
    setTimeout(nextEffect, 7000);
    //endregion

    //region play music in background
    var song;
    window.onload = function()
    {
        playSong();
    }

    function playSong()
    {
        song = new Audio();
        song.src = "music/" + getRandomInt(1, 13) + ".mp3";
        song.play();
        song.onended = playSong;
    }

    $(".stopMusicButt").click(function()
    {
        song.pause();
        $(".stopMusicButt").css("display", "none");
        $(".playMusicButt").css("display", "inline-block");
    });

    $(".playMusicButt").click(function()
    {
        song.play();
        $(".playMusicButt").css("display", "none");
        $(".stopMusicButt").css("display", "inline-block");
    });
    // //endregion

    //region subtract add buttons tweaks
    /*6. Редагування кількості товарів. В будь-якого не купленого товару можна редагувати кількість за
    допомогою кнопок + та -. Якщо кількість товарів 1, то кнопка - має бути не активною. Новий товар
    має створюватися з кількістю 1.*/
    function subtractButtonClicked()
    {
        var $fluid = $(this).parent(),
            newQuantity = parseInt($fluid.find(".prodQuantityInfo").text()) - 1;
        $fluid.find(".prodQuantityInfo").text(newQuantity);

        var $mainDiv = $fluid.parent().parent(),
            serialNumberChoosen = $mainDiv.index(),
            $divFromRightColumnToChange = $(".toBuyProducts .good:nth-child(" + serialNumberChoosen + ")");
        $divFromRightColumnToChange.find(".numberOfGoods").text(newQuantity);

        if(newQuantity == 1)
        {
            var $subtractButton = $fluid.find(".subtractProdButt");
            $subtractButton.removeClass("button subtractProdButt").addClass("subtractProdButtInactive");
            $subtractButton.unbind('click');
        }
    }

    function addButtonClicked()
    {
        var $fluid = $(this).parent(),
            newQuantity = parseInt($fluid.find(".prodQuantityInfo").text()) + 1;
        $fluid.find(".prodQuantityInfo").text(newQuantity);

        var $mainDiv = $fluid.parent().parent(),
            serialNumberChoosen = $mainDiv.index(),
            $divFromRightColumnToChange = $(".toBuyProducts .good:nth-child(" + serialNumberChoosen + ")");
        $divFromRightColumnToChange.find(".numberOfGoods").text(newQuantity);


        if(newQuantity == 2)
        {
            var $subtractButton = $fluid.find(".subtractProdButtInactive");
            $subtractButton.removeClass("subtractProdButtInactive").addClass("button subtractProdButt");
            $subtractButton.unbind('click');
            $subtractButton.click(subtractButtonClicked);
        }
    }
    $(".addProdButt").click(addButtonClicked);
    //endregion

    //region the hardest part
    /*7. Статистика в правій панелі. При зміні, назви, кількості, видаленні, зміни статусу куплено/не-куплено має
    оновлюватися статистика. В першій секції мають виводитися товар+кількість тих товарів, які ще необхідно купити.
    В другій секції мають виводитися товар+кількість тих які вже були куплені.*/
    //endregion

});