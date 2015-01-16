var appfilters = angular.module('appFilters',[]);

appfilters.filter('exactCountryId', function() {
        return function(input, val, prop) {

            return input.filter(function(item){

                return item[prop] == val[prop];

            });
        };
    });
appfilters.filter('filterWithNull', function() {
    return function(input, val, prop) {

        return input.filter(function(item){

            if(val == null)
                return true;

            return item[prop] == val;

        });
    };
});