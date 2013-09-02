DOM manipulation + observation performance test
-----------------------------------------------

This very simple test case tests the performance of a large amount of
DOM manipulations -- element additions and attribute changes -- and
monitoring those with Mutation Observers.

In the current state it is by no means exact or comprehensive but
gives a rough estimate and a starting point for further analysis.

Results
-------

On my (Erno) setup (Chrome, Ubuntu, 2 GHz Intel T4200) this shows
that running the test for 10k elements 100 times in a row,
the pure-js version takes 19 ms. The DOM version of same
takes 4700 ms. So a 250x difference.

How to replicate:
-----------------

toggle the do_dom bool in the script. then use the create
element button to create desired number of elements.
For timing, use the JS console:

    var start = Date.now(); modifyElements(); console.log(Date.now() - start);

add a for loop around modifyElements when testing the pure js version.

What is tested:
---------------

The dom version creates a scene element containing entity elements.
It then registers mutation callbacks for all the entities.
For the mutation operator, we iterate through the elements and
re-set the "id" attribute of entity elements.

The pure js version keeps a list of js objects in an array
that have "id" and "callback" attributes, patterned after
what happens in the dom test.

This is a microbenchmark and the functionality of the dom
& mutation observer is more complex than the JS skeleton.
