YUI().use('dd', 'transition', function(Y) {
  var overlay = Y.one('#overlay');
  var draggingUp = false;
  var draggingRight = false;
  var lastY = 0;
  var lastX = 0;

  //---------------------------------------------------------------------

  // Make a text node editable
  function TextNodeEditorPlugin(config) {
    var self = this;

    self._node = config.host;
    self._value = self._node.get('text');

    self._node.on('dblclick', function(e) {
      self.startEditing();
    });
  }

  TextNodeEditorPlugin.NS = 'editor';

  TextNodeEditorPlugin.prototype = {
    startEditing: function() {
      var self = this;
      var inputNode = Y.Node.create('<input type="text" value="' + self._value + '"/>');
      
      self._node.empty();
      self._node.append(inputNode);
      inputNode.focus();

      inputNode.on('keypress', function(e) {
        if (e.keyCode == 13) { // 13 => RETURN key
          self._value = inputNode.get('value');
          self.endEditing();
        }
      });

      inputNode.on('keyup', function(e) {
        if (e.keyCode == 27) self.endEditing(); // 27 => ESC key
      })

      inputNode.on('click', function(e) {
        // Capture the event so that the body doesn't get it
        e.stopImmediatePropagation();
      });

      // Register a click handler
      var escHandler = Y.one('#overlay').on('click', function(e) {
        self.endEditing();
        escHandler.detach();
        escHandler = null;
      });
    },

    endEditing: function() {
      this._node.empty();
      this._node.set('text', this._value);
    }
  }

  //---------------------------------------------------------------------

  Y.DD.DDM.on('ddm:end', function(e) {
    console.log('ddm:end');
    // Remove all empty column (both .empty and those who really have no childs left)
    Y.later(50, Y, function() {
      console.log('searching for empty columns ...');
      Y.all('.l3 .column').each(function(column) {
        if (!column.hasChildNodes()) {
          console.log('removing an empty column!');
          column.remove();                
        }
      });
    });
  });

  //---------------------------------------------------------------------
  // Pimp a grouping node code

  function pimpGroupingNode(grouping) {
    // Allow editing of the grouping title
    var groupingTitle = grouping.one('.grouping-title');
    if (groupingTitle) {
      groupingTitle.plug(TextNodeEditorPlugin);
    }

    var dd = new Y.DD.Drag({
      node: grouping,
      target: true
    }).plug(Y.Plugin.DDProxy, {
      moveOnEnd: false,
      cloneNode: true
    }).plug(Y.Plugin.DDConstrained, {
      constrain2node: overlay
    });
    dd.addHandle('.grouping-title');

    dd.on('drag:start', function(e) {
      var drag = e.target;
      drag.get('node').setStyle('opacity', '.25');
    });

    dd.on('drag:drag', function(e) {
      var x = e.target.lastXY[0];
      draggingRight = (x > lastX);
      lastX = x;
    });

    dd.on('drag:end', function(e) {
      var drag = e.target;
      drag.get('node').setStyle('opacity', '1.0');
    });

    dd.on('drag:over', function(e) {
      var drag = e.drag.get('node'),
        drop = e.drop.get('node');
      if (drop.get('tagName').toLowerCase() == 'ul') {
        drop.insert(drag, draggingRight ? 'after' : 'before');
      }
    });

  } 

  //---------------------------------------------------------------------
  // Pimp entries inside a grouping node

  function pimpEntries(grouping) {
    grouping.all('.l3').each(function(l3) {
      var emptyCol = false;

      l3.all('.column > li').each(function(li) {
        li.plug(TextNodeEditorPlugin);

        var dd = new Y.DD.Drag({ 
          node: li,
          target: true
        }).plug(Y.Plugin.DDProxy, {
          moveOnEnd: false,
          cloneNode: true
        }).plug(Y.Plugin.DDConstrained, {
          constrain2node: overlay
        });

        dd.on('drag:start', function(e) {
          var drag = e.target;
          drag.get('node').setStyle('opacity', '.25');

          emptyCol = Y.Node.create('<div class="column empty"></div>');
          l3.append(emptyCol);
          // Make emptyCol a drop taget
          var emptyColDrop = new Y.DD.Drop({ node: emptyCol });
          emptyColDrop.on('drop:hit', function(e) {
          });

          // Use a sexy fade-in transition :)
          emptyCol.transition({
            easing: 'ease-in',
            duration: 0.2,
            opacity: '1.0'
          }, function() {
            // When adding a new drop target during a drag operation
            // we have to manually call ._activateTargets() or
            // YUI3 won't see it
            Y.DD.DDM._activateTargets(); // workaround
          });
        });

        dd.on('drag:drag', function(e) {
          var y = e.target.lastXY[1];
          draggingUp = (y < lastY);
          lastY = y;
        });

        dd.on('drag:end', function(e) {
          var drag = e.target;
          drag.get('node').setStyle('opacity', '1.0');

          if (emptyCol.hasChildNodes()) {
            emptyCol.removeClass('empty'); // it's not empty anymore 
          } else {
            emptyCol.transition({
              easing: 'ease-out',
              duration: 0.2,
              opacity: '0.0'
            }, function() {
              emptyCol.remove();                
            });
          }
        });

        dd.on('drag:over', function(e) {
          var drag = e.drag.get('node'),
            drop = e.drop.get('node');
          if (drop.get('tagName').toLowerCase() == 'li') {
            drop.insert(drag, draggingUp ? 'before' : 'after');
            e.drop.sizeShim(); // Resize the drop shim because the size might have changed
          } else if (drop.hasClass('empty')) {
            drop.append(drag);
          }
        });

        dd.on('drag:drophit', function(e) {
          console.log('drop hit!');

          // The entry might have dragged to a new grouping. Therefore
          // we must update our l3 object so that it points
          // to its new ancestor!
          var newl3 = li.ancestor('.l3');
          console.log('my original grouping ID: ' + l3.get('id'));
          console.log('my current grouping ID: ' + newl3.get('id'));
          l3 = newl3;
        });
      });          
    });
  }

  //---------------------------------------------------------------------
  // Add New Section code 

  var addNewGroupingNode = overlay.one('.add-new-grouping');
  addNewGroupingNode.on('click', function(e) {
    var markup = 
      '<ul class="grouping l2">' +
        '<li>' +
          '<span class="grouping-title">Sample Title</span>' +
          '<ul class="l3">' +
            '<div class="column">' +
              '<li>Sample Entry</li>' +
            '</div>' +
          '</ul>' +
        '</li>' +
      '</ul>';
    
    var newGroupingNode = Y.Node.create(markup);
    var parent = addNewGroupingNode.get('parentNode').get('parentNode');
    parent.insert(newGroupingNode, 'before');

    pimpGroupingNode(newGroupingNode);
    pimpEntries(newGroupingNode);
  });

  //---------------------------------------------------------------------
  // Initialize system

  // Pimp all existing groups and their entries
  overlay.all('.grouping').each(function(grouping) {
    pimpGroupingNode(grouping);
    pimpEntries(grouping);
  });

});