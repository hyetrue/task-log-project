import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
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
import { Task, TaskPriority, TaskStatus } from '../types/task';
import {
  FileUp,
  Save,
  X,
  File,
  FileText,
  Image,
  FileVideo,
  FileAudio,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface TaskCreatePageProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  currentUser: { id: string; name: string; team: string };
}

export function TaskCreatePage({
  onCreateTask,
  currentUser,
}: TaskCreatePageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<TaskStatus>('in-progress');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = {
      title,
      content,
      status,
      priority,
      date,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      team: currentUser.team,
      attachments: attachments.map((file) => file.name),
    };

    onCreateTask(newTask);

    // Reset form
    setTitle('');
    setContent('');
    setStatus('in-progress');
    setPriority('medium');
    setDate(new Date().toISOString().split('T')[0]);
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast.success('업무가 등록되었습니다.');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const newFiles: FileAttachment[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}은(는) 10MB를 초과합니다.`);
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      });
    });

    if (newFiles.length > 0) {
      setAttachments([...attachments, ...newFiles]);
      toast.success(`${newFiles.length}개 파일이 첨부되었습니다.`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const file = attachments[index];
    URL.revokeObjectURL(file.url);
    setAttachments(attachments.filter((_, i) => i !== index));
    toast.success('파일이 제거되었습니다.');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className='w-4 h-4' />;
    if (type.startsWith('video/')) return <FileVideo className='w-4 h-4' />;
    if (type.startsWith('audio/')) return <FileAudio className='w-4 h-4' />;
    if (type.includes('pdf') || type.includes('document'))
      return <FileText className='w-4 h-4' />;
    return <File className='w-4 h-4' />;
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='mb-6'>
        <h2 className='text-3xl'>Add Task 📝</h2>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          새로운 업무를 등록하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>업무 정보 입력</CardTitle>
          <CardDescription>업무의 상세 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='date'>날짜</Label>
              <Input
                id='date'
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='title'>업무 제목</Label>
              <Input
                id='title'
                type='text'
                placeholder='업무 제목을 입력하세요'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='content'>업무 상세 내용</Label>
              <Textarea
                id='content'
                placeholder='업무의 상세 내용을 입력하세요'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='status'>업무 상태</Label>
                <Select
                  value={status}
                  onValueChange={(value: TaskStatus) => setStatus(value)}>
                  <SelectTrigger id='status'>
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
                <Label htmlFor='priority'>우선순위</Label>
                <Select
                  value={priority}
                  onValueChange={(value: TaskPriority) => setPriority(value)}>
                  <SelectTrigger id='priority'>
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

            <div className='space-y-2'>
              <Label>파일 첨부</Label>
              <div className='flex items-center gap-4'>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  onChange={handleFileSelect}
                  className='hidden'
                  id='file-upload'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}>
                  <FileUp className='w-4 h-4 mr-2' />
                  파일 선택
                </Button>
                {attachments.length > 0 && (
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {attachments.length}개 파일 첨부됨
                  </span>
                )}
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                최대 10MB까지 업로드 가능합니다.
              </p>
              {attachments.length > 0 && (
                <div className='mt-3 space-y-2'>
                  <TooltipProvider>
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors'>
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <div className='text-gray-500 dark:text-gray-400'>
                            {getFileIcon(file.type)}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className='text-sm truncate cursor-default'>
                                  {file.name}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='max-w-md break-all'>
                                  {file.name}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveFile(index)}
                          className='opacity-0 group-hover:opacity-100 transition-opacity'>
                          <X className='w-4 h-4 text-gray-500 hover:text-red-500' />
                        </Button>
                      </div>
                    ))}
                  </TooltipProvider>
                </div>
              )}
            </div>

            <div className='flex gap-3 pt-4'>
              <Button
                type='submit'
                className='flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'>
                <Save className='w-4 h-4 mr-2' />
                업무 등록
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setTitle('');
                  setContent('');
                  setStatus('in-progress');
                  setPriority('medium');
                  // Clean up file URLs
                  attachments.forEach((file) => URL.revokeObjectURL(file.url));
                  setAttachments([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}>
                초기화
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
