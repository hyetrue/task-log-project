import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import {
  Calendar,
  User,
  Building2,
  Save,
  X,
  FileUp,
  File,
  FileText,
  Image,
  FileVideo,
  FileAudio,
  Download,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskDetailModal({
  task,
  open,
  onClose,
  onUpdate,
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!task) return null;

  const handleEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTask) {
      onUpdate(editedTask.id, editedTask);
      setIsEditing(false);
      toast.success('업무가 수정되었습니다.');
    }
  };

  const handleCancel = () => {
    setEditedTask(null);
    setIsEditing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedTask) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const newFileNames: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}은(는) 10MB를 초과합니다.`);
        return;
      }
      newFileNames.push(file.name);
    });

    if (newFileNames.length > 0) {
      const currentAttachments = editedTask.attachments || [];
      setEditedTask({
        ...editedTask,
        attachments: [...currentAttachments, ...newFileNames],
      });
      toast.success(`${newFileNames.length}개 파일이 첨부되었습니다.`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    if (!editedTask) return;

    const currentAttachments = editedTask.attachments || [];
    const fileName = currentAttachments[index];

    setEditedTask({
      ...editedTask,
      attachments: currentAttachments.filter((_, i) => i !== index),
    });

    toast.success(`${fileName} 파일이 제거되었습니다.`);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <Image className='w-4 h-4' />;
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
      return <FileVideo className='w-4 h-4' />;
    }
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
      return <FileAudio className='w-4 h-4' />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
      return <FileText className='w-4 h-4' />;
    }
    return <File className='w-4 h-4' />;
  };

  const currentTask = editedTask || task;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>업무 상세 정보</DialogTitle>
          <DialogDescription>
            업무의 상세 정보를 확인하고 수정할 수 있습니다
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 mt-4'>
          {/* 기본 정보 */}
          <div className='grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <div className='flex items-center gap-2 text-sm'>
              <Calendar className='w-4 h-4 text-gray-500 dark:text-gray-400' />
              <span className='text-gray-600 dark:text-gray-400'>날짜:</span>
              <span>{new Date(task.date).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <User className='w-4 h-4 text-gray-500 dark:text-gray-400' />
              <span className='text-gray-600 dark:text-gray-400'>작성자:</span>
              <span>{task.employeeName}</span>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Building2 className='w-4 h-4 text-gray-500 dark:text-gray-400' />
              <span className='text-gray-600 dark:text-gray-400'>팀:</span>
              <span>{task.team}</span>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>ID:</span>
              <span className='font-mono text-xs'>{task.id}</span>
            </div>
          </div>

          {/* 편집 가능한 필드 */}
          {isEditing ? (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-title'>업무 제목</Label>
                <Input
                  id='edit-title'
                  value={currentTask.title}
                  onChange={(e) =>
                    setEditedTask({ ...currentTask, title: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-content'>업무 상세 내용</Label>
                <Textarea
                  id='edit-content'
                  value={currentTask.content}
                  onChange={(e) =>
                    setEditedTask({ ...currentTask, content: e.target.value })
                  }
                  rows={6}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-status'>업무 상태</Label>
                  <Select
                    value={currentTask.status}
                    onValueChange={(value: TaskStatus) =>
                      setEditedTask({ ...currentTask, status: value })
                    }>
                    <SelectTrigger id='edit-status'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='in-progress'>진행중</SelectItem>
                      <SelectItem value='completed'>완료</SelectItem>
                      <SelectItem value='on-hold'>보류</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='edit-priority'>우선순위</Label>
                  <Select
                    value={currentTask.priority}
                    onValueChange={(value: TaskPriority) =>
                      setEditedTask({ ...currentTask, priority: value })
                    }>
                    <SelectTrigger id='edit-priority'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='high'>높음</SelectItem>
                      <SelectItem value='medium'>보통</SelectItem>
                      <SelectItem value='low'>낮음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <div>
                <Label>업무 제목</Label>
                <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  {task.title}
                </div>
              </div>

              <div>
                <Label>업무 상세 내용</Label>
                <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap'>
                  {task.content}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>업무 상태</Label>
                  <div className='mt-2'>
                    <StatusBadge status={task.status} />
                  </div>
                </div>

                <div>
                  <Label>우선순위</Label>
                  <div className='mt-2'>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 첨부 파일 */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>첨부 파일</Label>
              {isEditing && (
                <div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    onChange={handleFileSelect}
                    className='hidden'
                    id='file-upload-edit'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}>
                    <FileUp className='w-4 h-4 mr-2' />
                    파일 추가
                  </Button>
                </div>
              )}
            </div>

            {currentTask.attachments && currentTask.attachments.length > 0 ? (
              <div className='mt-2 space-y-2'>
                <TooltipProvider>
                  {currentTask.attachments.map((file, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors'>
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className='text-gray-500 dark:text-gray-400 flex-shrink-0'>
                          {getFileIcon(file)}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className='text-sm truncate cursor-default'>
                                {file}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='max-w-md break-all'>{file}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        {!isEditing && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              toast.info(
                                '다운로드 기능은 데모에서 사용할 수 없습니다.'
                              )
                            }>
                            <Download className='w-4 h-4 text-gray-500 hover:text-blue-500' />
                          </Button>
                        )}
                        {isEditing && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => handleRemoveFile(index)}
                            className='opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Trash2 className='w-4 h-4 text-gray-500 hover:text-red-500' />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </TooltipProvider>
              </div>
            ) : (
              <div className='mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-500 dark:text-gray-400'>
                첨부된 파일이 없습니다.
              </div>
            )}

            {isEditing && (
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                최대 10MB까지 업로드 가능합니다.
              </p>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className='flex gap-3 pt-4 border-t dark:border-gray-700'>
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className='flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'>
                  <Save className='w-4 h-4 mr-2' />
                  저장
                </Button>
                <Button
                  onClick={handleCancel}
                  variant='outline'
                  className='flex-1'>
                  <X className='w-4 h-4 mr-2' />
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
                  className='flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'>
                  수정
                </Button>
                <Button onClick={onClose} variant='outline' className='flex-1'>
                  닫기
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
