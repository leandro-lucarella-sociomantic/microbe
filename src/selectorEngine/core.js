/**
 * pseudo.js
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */
var _cleanArray = function( _r ){ return !!( _r ); };

module.exports = function( Microbe )
{
    'use strict';

    /**
     * ## children
     *
     * Gets a microbe of all the given element's children
     *
     * @param {String} selector css selector string filter
     *
     * @example µ( '.example' ).children();
     * @example µ( '.example' ).children( 'div' );
     *
     * @return _Array_  array of microbes (value)
     */
    Microbe.core.children = function( selector )
    {
        var _constructor = this.constructor;

        var _children = function( _el )
        {
            _el = _constructor( _el.children );

            if ( typeof selector === 'string' )
            {
                return _el.filter( selector );
            }

            return  _el;
        };

        return this.map( _children );
    };


    /**
     * ## childrenFlat
     *
     * Gets an microbe of all children of all element's given
     *
     * @param {String} selector css selector string filter
     *
     * @example µ( '.example' ).childrenFlat();
     * @example µ( '.example' ).childrenFlat( 'div' );
     *
     * @return _Microbe_ value array of combined children
     */
    Microbe.core.childrenFlat = function( selector )
    {
        var i = 0, childrenArray = [];

        var _childrenFlat = function( _el )
        {
            var arr         = _el.children;
            var arrLength   = arr.length;

            for ( var j = 0; j < arrLength; j++ )
            {
                childrenArray[ i ] = arr[ j ];
                i++;
            }
        };

        this.each( _childrenFlat );

        var _el = this.constructor( childrenArray );

        if ( typeof selector === 'string' )
        {
            return _el.filter( selector );
        }

        return _el;
    };


    /**
     * ## filter
     *
     * Filters the microbe by the given given selector or function.  In the case
     * of a function, the element is passed as this. The inclusion on an element
     * into the set is based on the return of the function
     *
     * @param {Mixed} selector selector or function to filter by
     *
     * @example µ( '.example' ).filter( 'div' );
     * @example µ( '.example' ).filter( function( _el ){ return _el.tagName === 'div'; } );
     *
     * @return _Microbe_ new microbe containing only the filtered values
     */
    Microbe.core.filter = function( filter )
    {
        var pseudo, filters, self = this, _el, method;

        if ( this.length === 0 )
        {
            return this;
        }

        if ( typeof filter === 'function' )
        {
            var res = [];

            for ( var i = 0, lenI = this.length; i < lenI; i++ )
            {
                res[ i ] = filter.call( this[ i ], i ) ? this[ i ] : null;
            }
            res = res.filter( _cleanArray );

            return this.constructor( res );
        }
        else
        {
            var _filter = function( _f, _self, i )
            {
                if ( Microbe.pseudo[ _f[ 0 ] ] )
                {
                    return Microbe.pseudo[ _f[ 0 ] ]( _self, _f[ 1 ] );
                }
                else
                {
                    var resArray = [], _selector;
                    _selector = i === 0 ? _f[ 0 ] : ':' + _f[ 0 ];
                    if ( _selector !== '' )
                    {
                        if ( _f[ 1 ] !== '' )
                        {
                            _selector += '(' + _f[ 1 ] + ')';
                        }
                        for ( var j = 0, lenJ = _self.length; j < lenJ; j++ )
                        {
                            _el = _self[ j ];
                            resArray[ j ] = Microbe.matches( _el, _selector ) === true ? _el : null;
                        }
                        resArray = resArray.filter( _cleanArray );
                    }

                    return new Microbe( resArray );
                }
            };

            if ( filter && filter.indexOf( ':' ) !== -1 )
            {
                pseudo  = filter.split( ':' );
                filters = [ [ pseudo.splice( 0, 1 ).toString(), '' ] ];

                var _p, pseudoArray;

                for ( var h = 0, lenH = pseudo.length; h < lenH; h++ )
                {
                    _p = pseudo[ h ];

                    if ( _p.indexOf( '(' ) !== - 1 )
                    {
                        _p      = _p.split( '(' );
                        _p[ 1 ] = _p[ 1 ].replace( ')', '' );
                    }
                    else
                    {
                        _p      = [ _p, '' ];
                    }

                    filters.push( _p );
                }
            }
            else if ( filter )
            {
                filters = [ [ filter, '' ] ];
            }
            else
            {
                return this;
            }

            for ( var k = 0, lenK = filters.length; k < lenK; k++ )
            {
                if ( self.length !== 0 )
                {
                    if ( filters[ k ][ 0 ] !== '' )
                    {
                        self = _filter( filters[ k ], self, k );
                    }
                }
                else
                {
                    return self;
                }
            }

            return self;
        }
    };


    /**
     * ## find
     *
     * Finds a child element with the given selector inside the scope of the current microbe
     *
     * @param {String} selector            selector to search for
     *
     * @example µ( '.example' ).find( 'div' );
     *
     * @return _Microbe_ new microbe containing only the found children values
     */
    Microbe.core.find = function( _selector )
    {
        var _s          = _selector[ 0 ];

        if ( _s === ' ' )
        {
            _selector   = _selector.trim();
            _s          = _selector[ 0 ];
        }

        if ( _s === '>' )
        {
            _selector = _selector.slice( 1 ).trim();
            return this.childrenFlat().filter( _selector );
        }
        else if ( _s === '~' )
        {
            _selector = _selector.slice( 1 ).trim();
            return this.siblingsFlat().filter( _selector );
        }
        else if ( _s === '!' )
        {
            return this.parent();
        }
        else if ( _s === '+' )
        {
            _selector       = _selector.slice( 1 ).trim();
            var resArray    = [],
                _el, els    = this.children();

            for ( var i = 0, lenI = els.length; i < lenI; i++ )
            {
                _el = els[ i ][ 0 ];

                resArray[ i ] = _el ? _el : null;
            }

            resArray.filter( _cleanArray );

            return new Microbe( resArray ).filter( _selector );
        }
        else if ( _selector.indexOf( ':' ) !== -1 )
        {
            return this.constructor( _selector, this );
        }

        var _children = new Microbe( _selector ), res = [], r = 0;

        for ( var j = 0, lenJ = this.length; j < lenJ; j++ )
        {
            for ( var k = 0, lenK = _children.length; k < lenK; k++ )
            {
                if ( Microbe.contains( _children[ k ], this[ j ] ) )
                {
                    res[ r ] = _children[ k ];
                    r++;
                }
            }
        }

        return this.constructor( res );
    };


    /**
     * ## first
     *
     * gets the first Element and wraps it in Microbe.
     *
     * @example µ( '.example' ).first();
     *
     * @return _Microbe_ new Microbe containing only the first value
     */
    Microbe.core.first = function()
    {
        if ( this.length !== 0 )
        {
            return this.constructor( this[ 0 ] );
        }

        return this.constructor( [] );
    };


    /**
     * ## last
     *
     * Gets the last Element and wraps it in Microbe.
     *
     * @example µ( '.example' ).last();
     *
     * @return _Microbe_ new microbe containing only the last value
     */
    Microbe.core.last = function()
    {
        var len = this.length;

        if ( len === 1 )
        {
            return this;
        }
        else if ( len !== 0 )
        {
            return this.constructor( this[ len - 1 ] );
        }

        return this.constructor( [] );
    };


    /**
     * ## parent
     *
     * gets all elements in a microbe's parent nodes
     *
     * @example µ( '.example' ).parent();
     *
     * @return _Microbe_ new microbe containing parent elements (index-preserved)
     */
    Microbe.core.parent = function()
    {
        var _parent = function( _el )
        {
            return _el.parentNode;
        };

        var i, len, parentArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            parentArray[ i ] = _parent( this[ i ] );
        }

        return this.constructor( parentArray );
    };


    /**
     * ## siblings
     *
     * Gets an microbe of all of each given element's siblings
     *
     * @param {String} selector css selector string filter
     *
     * @example µ( '.example' ).siblings();;
     * @example µ( '.example' ).siblings( 'div' );
     *
     * @return _Array_ array of microbes (value)
     */
    Microbe.core.siblings = function( selector )
    {
        var _constructor = this.constructor;

        var _siblings = function( _el )
        {
            var res     = [], r = 0;
            var sibling = _el.parentNode.firstElementChild;
            for ( ; sibling; )
            {
                if ( sibling !== _el )
                {
                    res[ r ] = sibling;
                    r++;
                }
                sibling = sibling.nextElementSibling;
                if ( !sibling )
                {
                    res = _constructor( res );

                    if ( typeof selector === 'string' )
                    {
                        return res.filter( selector );
                    }

                    return res;
                }
            }
        };

        return this.map( _siblings );
    };


    /**
     * ## siblingsFlat
     *
     * Gets an microbe of all siblings of all element's given. 'next' and 'prev'
     * passed as direction return only the next or previous siblings of each element
     *
     * @param {String} direction direction modifier (optional)
     *
     * @example µ( '.example' ).siblingsFlat();
     * @example µ( '.example' ).siblingsFlat( 'div' );
     *
     * @return _Microbe_ value array of combined siblings
     */
    Microbe.core.siblingsFlat = function( selector )
    {
        var i = 0, siblingsArray = [];
        var isSiblingConnector = ( selector === '+' || selector === '~' );

        var _siblingsFlat = function( _el )
        {
            var sibling = _el;

            if ( !isSiblingConnector )
            {
                sibling = _el.parentNode.firstElementChild;
            }
            else
            {
                sibling = _el.nextElementSibling;
            }

            for ( ; sibling; )
            {
                if ( sibling !== _el && siblingsArray.indexOf( sibling ) === -1 )
                {
                    siblingsArray[ i ] = sibling;
                    i++;
                }
                sibling = sibling.nextElementSibling;

                if ( !sibling || selector === '+' )
                {
                    break;
                }
            }
        };

        this.each( _siblingsFlat );

        var _el = this.constructor( siblingsArray );

        if ( typeof selector === 'string' && !isSiblingConnector )
        {
            return _el.filter( selector );
        }

        return _el;
    };


    /**
     * ## toString
     *
     * Methods returns the type of Microbe.
     *
     * @example µ( '.example' ).toString();
     *
     * @return _String_
     */
    Microbe.core.toString = function()
    {
        return this.type;
    };
};