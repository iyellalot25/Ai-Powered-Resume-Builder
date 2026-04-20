import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableSection({ id, children }) {
  const {
    attributes, // accessibility props (aria-*)
    listeners, // drag event handlers (onPointerDown etc.)
    setNodeRef, // ref to attach to the DOM element
    transform, // current x/y position while dragging
    transition, // smooth animation when dropping
    isDragging, // true while this item is being dragged
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Slightly faded while dragging so user sees the "ghost"
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle — the ⠿ grip icon at the top of each section */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center gap-1
                   w-full py-1.5 mb-[-1.5rem]
                   cursor-grab active:cursor-grabbing
                   group"
        title="Drag to reorder"
      >
        {/* 6 dots — classic drag handle appearance */}
        <div
          className="flex gap-0.5 opacity-30 group-hover:opacity-100
                        transition-opacity duration-150"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-secondary" />
          ))}
        </div>
      </div>

      {/* The actual section content */}
      {children}
    </div>
  );
}

export default SortableSection;
