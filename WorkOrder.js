   function validateServicesAndProducts(executionContext){
    //debugger;
    var id = Xrm.Page.data.entity.getId();
    var fetchXml = '<fetch distinct="true" aggregate="true" >' +
    '<entity name="msdyn_workorder" >' +
      '<attribute name="msdyn_name" alias="recordCount" aggregate="count" />' +
      '<filter type="and" >' +
        '<condition attribute="msdyn_workorderid" operator="eq" value="'+id+'" />' +
      '</filter>' +
      '<link-entity name="msdyn_workorderservice" from="msdyn_workorder" to="msdyn_workorderid" link-type="inner" alias="ae" >' +
        '<filter type="and" >' +
          '<condition attribute="msdyn_linestatus" operator="eq" value="690970001" />' +
        '</filter>' +
      '</link-entity>' +
      '<link-entity name="msdyn_workorderproduct" from="msdyn_workorder" to="msdyn_workorderid" link-type="inner" alias="af" >' +
        '<filter type="and" >' +
          '<condition attribute="msdyn_linestatus" operator="eq" value="690970000" />' +
        '</filter>' +
      '</link-entity>' +
    '</entity>' +
  '</fetch>';
    var encodedFetchXml = encodeURI(fetchXml);
    var queryPath = "/api/data/v9.1/msdyn_workorders?fetchXml=" + encodedFetchXml;
    var requestPath = Xrm.Page.context.getClientUrl() + queryPath;
  
    var req = new XMLHttpRequest();
  
    req.open("GET", requestPath, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function ()
    {
      if (this.readyState === 4)
      {
        this.onreadystatechange = null;
        if (this.status === 200)
        {
          var returned = JSON.parse(this.responseText);
          var results = returned.value;
          //debugger;
          if(results.length > 0)
          {
            if(results[0].recordCount!==0){
              Xrm.Page.ui.setFormNotification('Please be sure to mark the appropriate products USED, enter the appropriate QUANTITY and TECH NOTES on those products.', 'WARNING');				
            }
          }
        }
        else
        {
          alert(this.statusText);
        }
      }
    };
    req.send();
  }