/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'events.js' );

    /**
     * µ emit tests
     *
     * @test    emit exists
     * @test    custom event emitted
     * @test    custom event bubbled
     */
    QUnit.test( '.emit()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().emit, 'exists' );
        var µExamples   = µ( '.example--class' );
        var µParent     = µExamples.parent();

        var emitTest    = assert.async();
        var bubbleTest  = µ.once( assert.async() );

        µExamples.on( 'emitTest', function( e )
        {
            µExamples.off();
            assert.equal( e.detail.doIt, '2 times', 'custom event emitted' );
            emitTest();
        });


        µParent.on( 'bubbleTest', function( e )
        {
            assert.equal( e.detail.bubbled, 'true', 'custom event bubbled' );
            µParent.off();
            bubbleTest();
        });


        µExamples.emit( 'emitTest', { doIt: '2 times' } );
        µParent.emit( 'bubbleTest', { bubbled: 'true' }, true );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        buildTest(
        'µDiv.emit( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function()
        {
            µDiv.emit( 'testClick', { wooo: 'i\'m a ghost!'} );
        },

        '$Div.trigger( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function()
        {
            $Div.trigger( 'testClick', { wooo: 'i\'m a ghost!'} );
        } );
    });


    /**
     * µ off tests
     *
     * @test    off exists
     * @test    listener removed
     */
    QUnit.test( '.off()', function( assert )
    {
        assert.ok( µ().off, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples.on( 'turningOff', function( e ){});
        µExamples.off( 'turningOff' );
        var func = µExamples[0].data[ '_turningOff-bound-function' ][0];

        assert.equal( func, null, 'listener removed' );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        var vanillaAddListener = function( divs )
        {
            for ( var i = 0, lenI = divs.length; i < lenI; i++ )
            {
                divs[ i ].addEventListener( 'click', _func );
                var aDiv = divs[ i ].data       = divs[ i ].data || {};
                aDiv[ '_click-bound-function' ] = [ _func ];
            }
        };

        var keyCode;
        var _func = function( e )
        {
            keyCode = e.keyCode;
        };

        buildTest(
        'µ( \'div\' ).off( \'click\', _func )', function()
        {
            vanillaAddListener( µDiv );
            µDiv.off( 'click', _func );
        },

        '$( \'div\' ).off( \'click\', _func )', function()
        {
            vanillaAddListener( $Div );
            $Div.off( 'click', _func );
        } );
    });


    /**
     * µ on tests
     *
     * @test    on exists
     * @test    sets unload data
     * @test    event correctly listened to
     */
    QUnit.test( '.on()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().on, 'exists' );

        var µExamples   = µ( '.example--class' );

        var onTest      = assert.async();

        µExamples.on( 'onTest', function( e )
        {
            var func = µExamples[0].data['_onTest-bound-function'][0];

            assert.equal( typeof func, 'function', 'sets unload data' );
            µExamples.off();
            assert.equal( e.detail.doIt, '2 times', 'event correctly listened to' );
            onTest();
        });

        µExamples.emit( 'onTest', { doIt: '2 times' } );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        var vanillaRemoveListener = function( divs )
        {
            for ( var i = 0, lenI = divs.length; i < lenI; i++ )
            {
                divs[ i ].removeEventListener( 'click', _func );
            }
        };

        var keyCode;
        var _func = function( e )
        {
            keyCode = e.keyCode;
        };

        buildTest(
        'µ( \'div\' ).on( \'click\', function(){} )', function()
        {
            µDiv.on( 'click', _func );
            vanillaRemoveListener( µDiv );
        },

        '$( \'div\' ).on( \'click\', function(){} )', function()
        {
            $Div.on( 'click', _func );
            vanillaRemoveListener( $Div );
        } );
    });
};
