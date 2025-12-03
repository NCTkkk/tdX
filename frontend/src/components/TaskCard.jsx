import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã xóa.");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi khi xóa nhiệm vụ:", error);
      toast.error("Lỗi khi xóa nhiệm vụ.");
    }
  };

  const updatedTask = async () => {
    try {
      setIsEditing(false);
      await api.put(`/tasks/${task._id}`, {
        title: updatedTaskTitle,
      });
      toast.success("Nhiệm vụ đã được cập nhật.");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi khi cập nhật nhiệm vụ:", error);
      toast.error("Lỗi khi cập nhật nhiệm vụ.");
    }
  };

  const toggleTaskCompleteButton = async () => {
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${task._id}`, {
          status: "complete",
          completedAt: new Date().toISOString,
        });
        toast.success(`${task.title} đã hoàn thành!`);
      } else {
        await api.put(`/tasks/${task._id}`, {
          status: "active",
          completedAt: null,
        });
        toast.success(`${task.title} đã đổi sang chưa hoàn thành!`);
      }
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Lỗi cập nhật trạng thái.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updatedTask();
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "complete" && "opacity-70"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Nút tròn */}
        <Button
          variant="secondary"
          size={"icon"}
          className={cn(
            "shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "complete"
              ? " text-success hover:text-success/80"
              : " text-muted-foreground hover:text-primary"
          )}
          onClick={toggleTaskCompleteButton}
        >
          {task.status === "complete" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* hiển thị hoặc chỉnh sửa tiêu đề */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              placeholder="Cần phải làm gì"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updatedTaskTitle}
              onChange={(e) => setUpdatedTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditing(false);
                setUpdatedTaskTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "complete"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}

          {/* Ngày tạo và ngày hoàn thành */}
          <div className="flex item-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* nút chỉnh và xóa */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* nút edit */}
          <Button
            variant={"ghost"}
            size={"icon"}
            className={
              "flex-shirnk-0 transition-colors size-8 text-muted-foreground hover:text-info"
            }
            onClick={() => {
              setIsEditing(true);
              setUpdatedTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* nút xóa */}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="flex-shirnk-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4"></Trash2>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
