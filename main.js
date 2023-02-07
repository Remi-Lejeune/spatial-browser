const container = document.getElementById("container");
      const box = document.getElementById('box');
      const select = document.getElementById('select');

      isMouseDown = false;
      let startX, startY, width, height;
      const windows = []
      color = getColor();

      function getColor() {

        const hue = Math.floor(Math.random() * 360);
        const saturation = "100%";
        const lightness = "50%";
        return "hsl(" + hue + ", " + saturation + ", " + lightness + ")";
      }

      function onMouseWheel(e) {

        const scaleAmount = e.deltaY / 500;
        const scale = -scaleAmount + 1;

        windows.forEach((window) => {

          const offSetX = window.x - e.clientX;
          const offSetY = window.y - e.clientY;

          window.resize(window.width * scale, window.height * scale)
          window.move(e.clientX + offSetX * scale, e.clientY + offSetY * scale);
        
        });
      }

      container.addEventListener('contextmenu', event => event.preventDefault());

      container.addEventListener("mousedown", (e) => {

        isMouseDown = true;

        startX = e.clientX;
        startY = e.clientY;
      
        if(e.button === 2) return;

        box.style.border = '1px solid';
        box.style.borderColor = color;
        select.style.zIndex = 9999;       
      });

      container.addEventListener("mousemove", (e) => {

        if(e.button === 1 || !isMouseDown) return;

        windows.forEach((window) => {window.move(window.x + e.movementX, window.y + e.movementY); });
      });

      container.addEventListener("mouseup", (e) => {

        isMouseDown = false;

        if(e.button === 2) return;

        select.style.zIndex = -1;

      });

      container.addEventListener("wheel", (e) => onMouseWheel(e));
      select.addEventListener("wheel", (e) => onMouseWheel(e));

      select.addEventListener("mousedown", (e) => {

        if(e.button === 2) return;

        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
      });

      select.addEventListener("mousemove", (e) => {

        if(e.button === 2) return;

        if (!isMouseDown) return;
        width = Math.abs(e.clientX - startX);
        height = Math.abs(e.clientY - startY);

        box.style.width = width + 'px';
        box.style.height = height + 'px';
        

        if(e.clientX < startX) box.style.left = e.clientX + 'px';
        else box.style.left = startX + 'px';

        if(e.clientY < startY) box.style.top = e.clientY + 'px';
        else box.style.top = startY + 'px';
      });

      select.addEventListener("mouseup", (e) => {

        if(e.button === 2) return;

        if (e.clientX < startX) x = e.clientX;
        else x = startX;

        if (e.clientY < startY) y = e.clientY;
        else y = startY;  

        const newWindow = new WinBox({
          x: x,
          y: y,
          width: width,
          height: height,
          onclose: () => {
            windows.splice(windows.indexOf(newWindow), 1);
          },
          mount: document.getElementById("page").cloneNode(true),
          class: ["no-animation","text"],
          background: color,
        });

        windows.push(newWindow);
        
        box.style.width = '0px';
        box.style.height = '0px';
        box.style.border = '0';

        isMouseDown = false;
        select.style.zIndex = -1;
        color = getColor();
      });

      document.addEventListener("keydown", (e) => { if(e.key === "Shift") select.style.zIndex = 9999;});
      document.addEventListener("keyup", (e) => { if(e.key === "Shift") select.style.zIndex = -1;});

