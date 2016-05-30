/*global MediumEditor */
'use strict';

angular.module('angular-medium-editor', [])

  .directive('mediumEditor', function() {

    function toInnerText(value) {
      var tempEl = document.createElement('div'),
          text;
      tempEl.innerHTML = value;
      text = tempEl.textContent || '';
      return text.trim();
    }

    return {
      require: 'ngModel',
      restrict: 'AE',
      scope: {
        bindOptions: '=',
        mediumInsert: '='
      },
      link: function(scope, iElement, iAttrs, ngModel) {

        angular.element(iElement).addClass('angular-medium-editor');

        // Global MediumEditor
        ngModel.editor = new MediumEditor(iElement, scope.bindOptions);

        if (scope.mediumInsert) {
          iElement.mediumInsert({
            editor: ngModel.editor,
            addons: scope.mediumInsert
          });
        }

        ngModel.$render = function() {
          iElement.html(ngModel.$viewValue || "");
          var placeholder = ngModel.editor.getExtensionByName('placeholder');
          if (placeholder) {
            placeholder.updatePlaceholder(iElement[0]);
          }
        };

        ngModel.$isEmpty = function(value) {
          if (/[<>]/.test(value)) {
            return toInnerText(value).length === 0;
          } else if (value) {
            return value.length === 0;
          } else {
            return true;
          }
        };

        ngModel.editor.subscribe('editableInput', function (event, editable) {
          var value;

          try {
            var obj = ngModel.editor.serialize();
            value = obj['element-0'].value;
          }
          catch (e) {
            value = '';
          }

          ngModel.$setViewValue(value);
        });

        scope.$watch('bindOptions', function(bindOptions) {
          ngModel.editor.init(iElement, bindOptions);
        });

        scope.$on('$destroy', function() {
          ngModel.editor.destroy();
        });
      }
    };

  });
