import "./Modal.css";
import { createPortal } from "preact/compat";
import { useRef, useEffect, useMemo } from "preact/hooks";

export function Modal({
  children = null,
  anchor,
  onRequestClose,
}: {
  children?: any,
  anchor?: HTMLElement,
  onRequestClose?: () => any,
}) {
  let root = document.getElementById("modals");
  let modalRef = useRef<HTMLElement>();

  let style = useMemo(() => {
    let rect = anchor.getBoundingClientRect();

    return {
      left: rect.x + rect.width,
      top: rect.y,
      marginLeft: 4,
    };
  }, [anchor]);

  useEffect(() => {
    let modal = modalRef.current;
    let anchorRect = anchor.getBoundingClientRect();
    let modalRect = modal.getBoundingClientRect();

    // TODO: Move when scrolling
  }, [modalRef, anchor]);

  let contents = (
    <div className="modal" ref={modalRef} style={style}>
      {children}
    </div>
  );

  useEffect(() => {
    let element = modalRef.current;

    function handleClick(event: MouseEvent) {
      if (!element.contains(event.target as HTMLElement)) {
        if (onRequestClose) {
          event.preventDefault();
          onRequestClose();
        }
      }
    }

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [modalRef]);


  return createPortal(contents, root);
}
