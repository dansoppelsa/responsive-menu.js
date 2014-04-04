var elements;

$.fn.responsiveMenu = function()
{
    elements = this;

    $(window).bind( 'resize orientationchange' , function()
    {
        windowWidth = getWindowWidth();

        elements.each(function(index, element)
        {
            setMenu( $(element) );
        });
    });

    elements.each(function(index, element)
    {
        setMenu( $(element) );
    });

};

function getWindowWidth()
{
    return Math.max( document.documentElement.clientWidth , window.innerWidth );
}


function setMenu( theMenu )
{
    // Check the width of the window
    var width = getWindowWidth();

    var trigger = theMenu.find( '.trigger' );
    var menu = theMenu.find( 'ul.menu' ).first();

    // If the width below 768px
    if( width < 768 ) {
        menu.hide();
        menu.removeClass( 'expanded' );
        trigger.removeClass( 'clicked' );

        // If the menu's trigger element currently DOES NOT have a click listener on it...
        if( ! hasClickHandler( trigger ) ) {

            // Add a click event handler for menu to expand/collapse to the trigger element
            trigger.click(function(e)
            {
                e.preventDefault();

                // If the menu is currently hidden
                if( $(this).parent().find('ul.menu').first().is(':hidden') ) {
                    elements.each(function(index, element)
                    {
                        $(element).find('ul.menu').first().removeClass('expanded');
                        $(element).find('ul.menu').first().css('display', 'none');
                        $(element).find('a.trigger').first().removeClass( 'clicked' );
                    });
                }

                menu.stop().slideToggle();
                menu.toggleClass( 'expanded' );
                $(this).toggleClass( 'clicked' );
            });
            // Add a click event handler to any menu item that has a sub menu-item
            addListExpander( menu );
        }

    }
    // If the width greater than 768px
    else if( width >= 768 ) {

        menu.removeAttr( 'style' );

        // If the menu's trigger element currently DOES have a click listener on it....
        if( hasClickHandler( trigger ) ) {
            // Remove the click event handler on the trigger element
            trigger.unbind( 'click' );
            // Remove the click event handler from all subsequent nested menus
            removeListExpander( menu );
        }

    }

}


function addListExpander( list )
{
    list.find( '> li').each(function(index, listItem)
    {
        var listItem = $(listItem);
        var trigger = listItem.find( '> a' ).first();
        var list = listItem.find( '> ul' ).first();

        if( listItemHasSubMenu( listItem ) && ! hasClickHandler( trigger ) ) {

            list.hide();
            list.removeClass( 'expanded' );

            trigger.click(function(e)
            {
                e.preventDefault();
                list.stop().slideToggle();
                list.toggleClass( 'expanded' );
                addListExpander( list );
            });
        }

    });
}


function removeListExpander( list )
{
    list.find( '> li').each(function(index, listItem)
    {
        var listItem = $(listItem);
        var trigger = listItem.find( '> a' ).first();
        var list = listItem.find( '> ul' ).first();

        list.removeAttr( 'style' );

        if( listItemHasSubMenu( listItem ) && hasClickHandler( trigger ) ) {
            trigger.unbind( 'click' );
            removeListExpander( list );
        }

    });
}


/**
 * Determines if the given list item contains a sub-menu
 * @param listItem
 * @returns {boolean}
 */
function listItemHasSubMenu( listItem )
{
    return listItem.find('ul').length > 0;
}


/**
 * Determines whether the element passed in currently has a click
 * handler attached to it
 * @param element
 * @returns {boolean}
 */
function hasClickHandler( element )
{
    var handler = $._data( element.get(0) , 'events' );

    if( ! handler )
        return false;

    if( ! handler.click )
        return false;

    return true;
}