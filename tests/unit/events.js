/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'events.js' );


    QUnit.test( '.emit()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().emit, 'exists' );
        var µExamples   = µ( '.example--class' );
        var µParent     = µExamples.parent();

        var emitTest    = assert.async();
        var bubbleTest  = assert.async();

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
    });


    QUnit.test( '.on()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().on, 'exists' );

        var µExamples   = µ( '.example--class' );

        var onTest      = assert.async();

        µExamples.on( 'onTest', function( e )
        {
            var func = µExamples[0].data['_onTest-bound-function']['_onTest-bound-function'][0];

            assert.equal( typeof func, 'function', 'sets unload data' );
            µExamples.off();
            assert.equal( e.detail.doIt, '2 times', 'event correctly listened to' );
            onTest();
        });

        µExamples.emit( 'onTest', { doIt: '2 times' } );
    });


    QUnit.test( '.off()', function( assert )
    {
        assert.ok( µ().off, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples.on( 'turningOff', function( e ){});
        µExamples.off( 'turningOff' );
        var func = µExamples[0].data['_turningOff-bound-function']['_turningOff-bound-function'][0];

        assert.equal( func, null, 'listener removed' );
    });
};